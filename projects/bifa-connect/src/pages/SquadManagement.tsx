import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Plus, Crown, X, ArrowLeft } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  country: string;
  flag: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  squad_number?: number;
  is_captain?: boolean;
}

export default function SquadManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [squadPlayers, setSquadPlayers] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [squadNumber, setSquadNumber] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchSquad();
      fetchAvailablePlayers();
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      setTeams([
        { id: 't001', name: 'Flamengo', country: 'Brazil', flag: '🇧🇷' },
        { id: 't002', name: 'Mumbai City FC', country: 'India', flag: '🇮🇳' },
      ]);
    }
  };

  const fetchSquad = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', selectedTeam)
        .order('squad_number');
      if (error) throw error;
      setSquadPlayers(data || []);
    } catch (error) {
      setSquadPlayers([]);
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .is('team_id', null)
        .eq('status', 'active');
      if (error) throw error;
      setAvailablePlayers(data || []);
    } catch (error) {
      setAvailablePlayers([]);
    }
  };

  const handleAddToSquad = async () => {
    if (!selectedPlayer || !squadNumber) {
      toast.error('Please select player and squad number');
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .update({
          team_id: selectedTeam,
          squad_number: parseInt(squadNumber),
        })
        .eq('id', selectedPlayer);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'PLAYER_ADDED_TO_SQUAD',
        module: 'Team Management',
        entity_id: selectedTeam,
        details: `Added player to squad with number ${squadNumber}`,
      });

      toast.success('Player added to squad');
      setShowAddDialog(false);
      setSelectedPlayer('');
      setSquadNumber('');
      fetchSquad();
      fetchAvailablePlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player to squad');
    }
  };

  const handleRemoveFromSquad = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          team_id: null,
          squad_number: null,
          is_captain: false,
        })
        .eq('id', playerId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'PLAYER_REMOVED_FROM_SQUAD',
        module: 'Team Management',
        entity_id: selectedTeam,
        details: `Removed player from squad`,
      });

      toast.success('Player removed from squad');
      fetchSquad();
      fetchAvailablePlayers();
    } catch (error) {
      console.error('Error removing player:', error);
      toast.error('Failed to remove player');
    }
  };

  const handleSetCaptain = async (playerId: string) => {
    try {
      // Remove captain from all players in team
      await supabase
        .from('players')
        .update({ is_captain: false })
        .eq('team_id', selectedTeam);

      // Set new captain
      const { error } = await supabase
        .from('players')
        .update({ is_captain: true })
        .eq('id', playerId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'CAPTAIN_DESIGNATED',
        module: 'Team Management',
        entity_id: selectedTeam,
        details: `Designated new team captain`,
      });

      toast.success('Captain designated');
      fetchSquad();
    } catch (error) {
      console.error('Error setting captain:', error);
      toast.error('Failed to set captain');
    }
  };

  const handleUpdateSquadNumber = async (playerId: string, newNumber: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ squad_number: parseInt(newNumber) })
        .eq('id', playerId);

      if (error) throw error;
      toast.success('Squad number updated');
      fetchSquad();
    } catch (error) {
      toast.error('Failed to update squad number');
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
          <h1 className="text-3xl font-bold mb-2">Squad Management</h1>
          <p className="text-muted-foreground">Manage team rosters and designate captains</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Team</label>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Choose a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map(t => (
              <SelectItem key={t.id} value={t.id}>
                {t.flag} {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeam && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Squad ({squadPlayers.length} players)</h2>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">No.</th>
                    <th className="text-left p-4">Player</th>
                    <th className="text-left p-4">Position</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {squadPlayers.map((player) => (
                    <tr key={player.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={player.squad_number || ''}
                          onChange={(e) => handleUpdateSquadNumber(player.id, e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{player.name}</span>
                          {player.is_captain && (
                            <Badge className="bg-yellow-500">
                              <Crown className="w-3 h-3 mr-1" />
                              Captain
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{player.position}</td>
                      <td className="p-4">
                        <Badge variant="outline">Active</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {!player.is_captain && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetCaptain(player.id)}
                            >
                              <Crown className="w-4 h-4 mr-1" />
                              Set Captain
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveFromSquad(player.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {squadPlayers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No players in squad. Add players to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Player to Squad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Player</label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Squad Number</label>
              <Input
                type="number"
                min="1"
                max="99"
                placeholder="e.g., 10"
                value={squadNumber}
                onChange={(e) => setSquadNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddToSquad}>Add to Squad</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
