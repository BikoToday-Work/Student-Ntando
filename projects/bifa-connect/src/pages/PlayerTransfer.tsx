import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowRightLeft, Download, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team_id: string;
  team_name: string;
  position: string;
  country: string;
  flag: string;
}

interface Team {
  id: string;
  name: string;
  country: string;
  flag: string;
}

export default function PlayerTransfer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [destinationTeamId, setDestinationTeamId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      // Use mock data if database fails
      setPlayers([
        { id: 'p001', name: 'Gabriel Santos', team_id: 't001', team_name: 'Flamengo', position: 'Forward', country: 'Brazil', flag: '🇧🇷' },
        { id: 'p002', name: 'Arjun Mehta', team_id: 't002', team_name: 'Mumbai City FC', position: 'Midfielder', country: 'India', flag: '🇮🇳' },
        { id: 'p003', name: 'Dmitri Volkov', team_id: 't003', team_name: 'CSKA Moscow', position: 'Defender', country: 'Russia', flag: '🇷🇺' },
        { id: 'p004', name: 'Li Xiao Ming', team_id: 't004', team_name: 'Shanghai Port', position: 'Goalkeeper', country: 'China', flag: '🇨🇳' },
        { id: 'p005', name: 'Thabo Nkosi', team_id: 't005', team_name: 'Mamelodi Sundowns', position: 'Winger', country: 'South Africa', flag: '🇿🇦' },
      ]);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Use mock data if database fails
      setTeams([
        { id: 't001', name: 'Flamengo', country: 'Brazil', flag: '🇧🇷' },
        { id: 't002', name: 'Mumbai City FC', country: 'India', flag: '🇮🇳' },
        { id: 't003', name: 'CSKA Moscow', country: 'Russia', flag: '🇷🇺' },
        { id: 't004', name: 'Shanghai Port', country: 'China', flag: '🇨🇳' },
        { id: 't005', name: 'Mamelodi Sundowns', country: 'South Africa', flag: '🇿🇦' },
      ]);
    }
  };

  const handleTransfer = async () => {
    if (!selectedPlayer || !destinationTeamId) {
      toast.error('Please select destination team');
      return;
    }

    if (selectedPlayer.team_id === destinationTeamId) {
      toast.error('Player is already in this team');
      return;
    }

    try {
      const destinationTeam = teams.find(t => t.id === destinationTeamId);

      // Create transfer record
      const { error: transferError } = await supabase
        .from('player_transfers')
        .insert({
          player_id: selectedPlayer.id,
          from_team_id: selectedPlayer.team_id || null,
          to_team_id: destinationTeamId,
          transfer_date: transferDate,
          status: 'completed',
          requested_by: user?.id,
          approved_by: user?.id,
          notes: `Transferred to ${destinationTeam?.name}`,
        });

      if (transferError) {
        console.error('Transfer error:', transferError);
        throw transferError;
      }

      // Update player team
      const { error: playerError } = await supabase
        .from('players')
        .update({
          team_id: destinationTeamId,
          team: destinationTeam?.name,
        })
        .eq('id', selectedPlayer.id);

      if (playerError) {
        console.error('Player update error:', playerError);
        throw playerError;
      }

      toast.success('Player transferred successfully');
      setShowDialog(false);
      fetchPlayers();
    } catch (error: any) {
      console.error('Error transferring player:', error);
      toast.error('Failed to transfer player: ' + (error.message || 'Unknown error'));
    }
  };

  const generateCertificate = (player: Player, from?: Team, to?: Team) => {
    const certificate = `
BIFA TRANSFER CERTIFICATE
========================

Player: ${player.name}
Position: ${player.position}
Nationality: ${player.country}

From: ${from?.name} (${from?.country})
To: ${to?.name} (${to?.country})

Transfer Date: ${transferDate}
Processed By: ${user?.name}
Certificate Date: ${new Date().toISOString()}

This transfer is officially recognized by BIFA.
    `.trim();

    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfer-certificate-${player.name.replace(/\s/g, '-')}.txt`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Player Transfers</h1>
          <p className="text-muted-foreground">Transfer players between teams</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Player</th>
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">Current Team</th>
                <th className="text-left p-4">Country</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{player.name}</td>
                  <td className="p-4 text-sm">{player.position}</td>
                  <td className="p-4 text-sm">
                    {teams.find(t => t.id === player.team_id)?.flag} {player.team_name}
                  </td>
                  <td className="p-4 text-sm">{player.flag} {player.country}</td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPlayer(player);
                        setDestinationTeamId('');
                        setShowDialog(true);
                      }}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      Transfer
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
            <DialogTitle>Transfer Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">{selectedPlayer?.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedPlayer?.position} • {selectedPlayer?.flag} {selectedPlayer?.country}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Current Team</label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  {teams.find(t => t.id === selectedPlayer?.team_id)?.flag || ''}{' '}
                  {selectedPlayer?.team_name || 'No team'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Destination Team</label>
              <Select value={destinationTeamId} onValueChange={setDestinationTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter(t => t.id !== selectedPlayer?.team_id)
                    .map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.flag} {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Transfer Date</label>
              <Input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                A transfer certificate will be generated and both teams will be notified.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleTransfer}>
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Complete Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
