import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Ban, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team_name: string;
  position: string;
  flag: string;
  status: string;
}

export default function PlayerSuspension() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    duration_type: 'matches',
    duration_value: '',
    affected_competitions: '',
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      setPlayers([
        { id: 'p001', name: 'Gabriel Santos', team_name: 'Flamengo', position: 'Forward', flag: '🇧🇷', status: 'active' },
        { id: 'p002', name: 'Arjun Mehta', team_name: 'Mumbai City FC', position: 'Midfielder', flag: '🇮🇳', status: 'active' },
      ]);
    }
  };

  const handleSuspend = async () => {
    if (!formData.reason || !formData.duration_value) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Create suspension record
      const { error: suspError } = await supabase
        .from('suspensions')
        .insert({
          player_id: selectedPlayer?.id,
          player_name: selectedPlayer?.name,
          team_name: selectedPlayer?.team_name,
          reason: formData.reason,
          duration_matches: formData.duration_type === 'matches' ? parseInt(formData.duration_value) : null,
          duration_days: formData.duration_type === 'days' ? parseInt(formData.duration_value) : null,
          affected_competitions: formData.affected_competitions,
          start_date: new Date().toISOString(),
          status: 'active',
          issued_by: user?.name,
        });

      if (suspError) throw suspError;

      // Update player status
      const { error: playerError } = await supabase
        .from('players')
        .update({ status: 'suspended' })
        .eq('id', selectedPlayer?.id);

      if (playerError) throw playerError;

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'PLAYER_SUSPENDED',
        module: 'Player Management',
        entity_id: selectedPlayer?.id,
        details: `Suspended ${selectedPlayer?.name} for ${formData.duration_value} ${formData.duration_type}`,
      });

      toast.success('Player suspended successfully');
      setShowDialog(false);
      setFormData({
        reason: '',
        duration_type: 'matches',
        duration_value: '',
        affected_competitions: '',
      });
      fetchPlayers();
    } catch (error) {
      console.error('Error suspending player:', error);
      toast.error('Failed to suspend player');
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
          <h1 className="text-3xl font-bold mb-2">Player Suspension</h1>
          <p className="text-muted-foreground">Suspend players for disciplinary reasons</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Player</th>
                <th className="text-left p-4">Team</th>
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{player.flag}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{player.team_name}</td>
                  <td className="p-4 text-sm">{player.position}</td>
                  <td className="p-4 text-sm capitalize">{player.status}</td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedPlayer(player);
                        setShowDialog(true);
                      }}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">
                {selectedPlayer?.flag} {selectedPlayer?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedPlayer?.team_name} • {selectedPlayer?.position}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Reason *</label>
              <Textarea
                placeholder="Reason for suspension..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration Type</label>
                <Select
                  value={formData.duration_type}
                  onValueChange={(v) => setFormData({ ...formData, duration_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matches">Matches</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration *</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Number"
                  value={formData.duration_value}
                  onChange={(e) => setFormData({ ...formData, duration_value: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Affected Competitions</label>
              <Input
                placeholder="e.g., All BIFA competitions"
                value={formData.affected_competitions}
                onChange={(e) => setFormData({ ...formData, affected_competitions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
