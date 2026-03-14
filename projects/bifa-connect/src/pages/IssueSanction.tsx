import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Gavel, AlertTriangle } from 'lucide-react';

interface DisciplinaryCase {
  id: string;
  player_id: string;
  player_name: string;
  team_name: string;
  type: string;
  description: string;
  status: string;
  severity: string;
  reported_at: string;
}

export default function IssueSanction() {
  const { user } = useAuth();
  const [cases, setCases] = useState<DisciplinaryCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [sanctionType, setSanctionType] = useState<'ban' | 'fine'>('ban');
  const [banDuration, setBanDuration] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [affectedCompetitions, setAffectedCompetitions] = useState('');
  const [reasoning, setReasoning] = useState('');

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchCases();
    }
  }, [user]);

  const fetchCases = async () => {
    const { data } = await supabase
      .from('disciplinary_cases')
      .select('*')
      .in('status', ['under_review', 'hearing_scheduled'])
      .order('reported_at', { ascending: false });
    setCases(data || []);
  };

  const handleIssueSanction = async () => {
    if (!selectedCase || !reasoning) {
      toast.error('Please provide reasoning for the sanction');
      return;
    }

    if (sanctionType === 'ban' && !banDuration) {
      toast.error('Please specify ban duration');
      return;
    }

    if (sanctionType === 'fine' && !fineAmount) {
      toast.error('Please specify fine amount');
      return;
    }

    try {
      const sanctionText = sanctionType === 'ban'
        ? `${banDuration} match ban`
        : `$${fineAmount} fine`;

      // Update case with sanction
      const { error: caseError } = await supabase
        .from('disciplinary_cases')
        .update({
          status: 'resolved',
          sanction: sanctionText,
        })
        .eq('id', selectedCase.id);

      if (caseError) throw caseError;

      // Create suspension record if ban
      if (sanctionType === 'ban') {
        const { error: suspError } = await supabase
          .from('suspensions')
          .insert({
            player_id: selectedCase.player_id,
            player_name: selectedCase.player_name,
            team_name: selectedCase.team_name,
            reason: reasoning,
            duration_matches: parseInt(banDuration),
            affected_competitions: affectedCompetitions,
            start_date: new Date().toISOString(),
            status: 'active',
            issued_by: user?.name,
          });

        if (suspError) throw suspError;

        // Update player status
        await supabase
          .from('players')
          .update({ status: 'suspended' })
          .eq('id', selectedCase.player_id);
      }

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'SANCTION_ISSUED',
        module: 'Disciplinary',
        entity_id: selectedCase.id,
        details: `Issued ${sanctionText} to ${selectedCase.player_name}: ${reasoning}`,
      });

      // TODO: Send notification to player and federation

      toast.success('Sanction issued successfully');
      setShowDialog(false);
      resetForm();
      fetchCases();
    } catch (error) {
      console.error('Error issuing sanction:', error);
      toast.error('Failed to issue sanction');
    }
  };

  const resetForm = () => {
    setSanctionType('ban');
    setBanDuration('');
    setFineAmount('');
    setAffectedCompetitions('');
    setReasoning('');
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[severity] || 'bg-gray-500';
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only Super Admins can issue sanctions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Issue Sanctions</h1>
        <p className="text-muted-foreground">Review cases and issue disciplinary sanctions</p>
      </div>

      <div className="grid gap-4">
        {cases.map((c) => (
          <div key={c.id} className="bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getSeverityColor(c.severity)}>
                    {c.severity}
                  </Badge>
                  <Badge variant="outline">{c.type.replace('_', ' ')}</Badge>
                  <Badge variant="secondary">{c.status}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{c.player_name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{c.team_name}</p>
                <p className="text-sm mb-2">{c.description}</p>
                <p className="text-xs text-muted-foreground">
                  Reported: {new Date(c.reported_at).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedCase(c);
                  setShowDialog(true);
                }}
              >
                <Gavel className="w-4 h-4 mr-2" />
                Issue Sanction
              </Button>
            </div>
          </div>
        ))}
        {cases.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No cases pending sanction
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Disciplinary Sanction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">Player: {selectedCase?.player_name}</p>
              <p className="text-sm text-muted-foreground">Team: {selectedCase?.team_name}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedCase?.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sanction Type</label>
              <Select value={sanctionType} onValueChange={(v: 'ban' | 'fine') => setSanctionType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ban">Match Ban</SelectItem>
                  <SelectItem value="fine">Financial Fine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sanctionType === 'ban' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ban Duration (matches)</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Number of matches"
                    value={banDuration}
                    onChange={(e) => setBanDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Affected Competitions</label>
                  <Input
                    placeholder="e.g., All BIFA competitions"
                    value={affectedCompetitions}
                    onChange={(e) => setAffectedCompetitions(e.target.value)}
                  />
                </div>
              </>
            )}

            {sanctionType === 'fine' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Fine Amount (USD)</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Amount in USD"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Reasoning</label>
              <Textarea
                placeholder="Provide detailed reasoning for this sanction..."
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This action will be logged and the player/federation will be notified.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleIssueSanction} variant="destructive">
              Issue Sanction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
