import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { createNotification } from '@/lib/notifications';

interface Entry {
  id: string;
  team_name: string;
  team_flag: string;
  competition_name: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  squad_size: number;
}

export default function CompetitionEntries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('competition_entries')
        .select(`
          id,
          status,
          requested_at,
          rejection_reason,
          team:teams(name, flag, country),
          competition:competitions(name, season)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedEntries = (data || []).map(entry => ({
        id: entry.id,
        team_name: entry.team?.name || 'Unknown Team',
        team_flag: entry.team?.flag || '🏴',
        competition_name: `${entry.competition?.name || 'Unknown'} - ${entry.competition?.season || ''}`,
        submitted_at: entry.requested_at,
        status: entry.status as 'pending' | 'approved' | 'rejected',
        squad_size: 0
      }));
      
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load competition entries');
      setEntries([]);
    }
  };

  const handleDecision = async () => {
    if (action === 'reject' && !reason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const { error } = await supabase
        .from('competition_entries')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', selectedEntry?.id);

      if (error) throw error;

      // Get team manager email
      const { data: teamData } = await supabase
        .from('teams')
        .select('manager_email, manager_name')
        .eq('name', selectedEntry?.team_name)
        .single();

      // Send notification to team manager
      if (teamData?.manager_email) {
        await createNotification(
          teamData.manager_email,
          action === 'approve' ? 'Competition Entry Approved' : 'Competition Entry Rejected',
          action === 'approve'
            ? `Your team ${selectedEntry?.team_name} has been approved for ${selectedEntry?.competition_name}`
            : `Your team ${selectedEntry?.team_name} entry was rejected for ${selectedEntry?.competition_name}. Reason: ${reason}`,
          action === 'approve' ? 'success' : 'error',
          '/dashboard/team-manager'
        );
      }

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: action === 'approve' ? 'ENTRY_APPROVED' : 'ENTRY_REJECTED',
        module: 'Competition Management',
        entity_id: selectedEntry?.id,
        details: `${action === 'approve' ? 'Approved' : 'Rejected'} entry for ${selectedEntry?.team_name}`,
      });

      toast.success(`Entry ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowDialog(false);
      setReason('');
      fetchEntries();
    } catch (error) {
      console.error('Error processing entry:', error);
      toast.error('Failed to process entry');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Competition Entries</h1>
          <p className="text-muted-foreground">Review and approve team entries</p>
        </div>
      </div>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{entry.team_flag}</span>
                  <h3 className="font-semibold text-lg">{entry.team_name}</h3>
                  <Badge variant="outline">{entry.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Competition: {entry.competition_name}
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Squad Size: {entry.squad_size} players
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(entry.submitted_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedEntry(entry);
                    setAction('approve');
                    setShowDialog(true);
                  }}
                  variant="default"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setSelectedEntry(entry);
                    setAction('reject');
                    setShowDialog(true);
                  }}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No pending entries
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve' : 'Reject'} Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">
                {selectedEntry?.team_flag} {selectedEntry?.team_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedEntry?.competition_name}
              </p>
            </div>
            {action === 'reject' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason for Rejection *
                </label>
                <Textarea
                  placeholder="Provide detailed reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            )}
            {action === 'approve' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  placeholder="Any additional notes..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDecision}
              variant={action === 'approve' ? 'default' : 'destructive'}
            >
              {action === 'approve' ? 'Approve Entry' : 'Reject Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
