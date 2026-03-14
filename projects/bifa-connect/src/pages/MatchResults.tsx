import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trophy, Edit } from 'lucide-react';

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  competition: string;
  kickoff_utc: string;
  venue: string;
  status: string;
  home_score?: number;
  away_score?: number;
}

export default function MatchResults() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['scheduled', 'live'])
      .order('kickoff_utc', { ascending: true });
    setMatches(data || []);
  };

  const handleUpdateResult = async () => {
    if (!selectedMatch || homeScore === '' || awayScore === '') {
      toast.error('Please enter both scores');
      return;
    }

    try {
      const home = parseInt(homeScore);
      const away = parseInt(awayScore);

      // Update match
      const { error } = await supabase
        .from('matches')
        .update({
          home_score: home,
          away_score: away,
          status: 'completed',
        })
        .eq('id', selectedMatch.id);

      if (error) throw error;

      // Update team statistics
      await updateTeamStats(selectedMatch, home, away);

      // Recalculate standings
      await recalculateStandings(selectedMatch.competition);

      // Log action
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'MATCH_RESULT_UPDATED',
        module: 'Competitions',
        entity_id: selectedMatch.id,
        details: `${selectedMatch.home_team} ${home}-${away} ${selectedMatch.away_team}`,
      });

      toast.success('Match result updated successfully');
      setShowDialog(false);
      fetchMatches();
    } catch (error) {
      console.error('Error updating result:', error);
      toast.error('Failed to update match result');
    }
  };

  const updateTeamStats = async (match: Match, homeScore: number, awayScore: number) => {
    const homeWin = homeScore > awayScore;
    const draw = homeScore === awayScore;
    const awayWin = awayScore > homeScore;

    // Update home team
    const { data: homeTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('name', match.home_team)
      .single();

    if (homeTeam) {
      await supabase
        .from('teams')
        .update({
          played: homeTeam.played + 1,
          won: homeTeam.won + (homeWin ? 1 : 0),
          drawn: homeTeam.drawn + (draw ? 1 : 0),
          lost: homeTeam.lost + (awayWin ? 1 : 0),
          goals_for: homeTeam.goals_for + homeScore,
          goals_against: homeTeam.goals_against + awayScore,
          points: homeTeam.points + (homeWin ? 3 : draw ? 1 : 0),
        })
        .eq('id', homeTeam.id);
    }

    // Update away team
    const { data: awayTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('name', match.away_team)
      .single();

    if (awayTeam) {
      await supabase
        .from('teams')
        .update({
          played: awayTeam.played + 1,
          won: awayTeam.won + (awayWin ? 1 : 0),
          drawn: awayTeam.drawn + (draw ? 1 : 0),
          lost: awayTeam.lost + (homeWin ? 1 : 0),
          goals_for: awayTeam.goals_for + awayScore,
          goals_against: awayTeam.goals_against + homeScore,
          points: awayTeam.points + (awayWin ? 3 : draw ? 1 : 0),
        })
        .eq('id', awayTeam.id);
    }
  };

  const recalculateStandings = async (competition: string) => {
    const { data: teams } = await supabase
      .from('teams')
      .select('*')
      .eq('league', competition)
      .order('points', { ascending: false });

    // Standings are automatically sorted by points in the query
    // Additional logic for goal difference can be added here if needed
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Match Results</h1>
        <p className="text-muted-foreground">Update match scores and standings</p>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{match.competition}</Badge>
                  <Badge variant={match.status === 'live' ? 'destructive' : 'secondary'}>
                    {match.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{match.home_flag}</span>
                    <span className="font-semibold">{match.home_team}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {match.home_score !== undefined ? match.home_score : '-'}
                  </div>
                  <div className="text-muted-foreground">vs</div>
                  <div className="text-2xl font-bold text-primary">
                    {match.away_score !== undefined ? match.away_score : '-'}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-semibold">{match.away_team}</span>
                    <span className="text-2xl">{match.away_flag}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {match.venue} • {new Date(match.kickoff_utc).toLocaleString()}
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedMatch(match);
                  setHomeScore(match.home_score?.toString() || '');
                  setAwayScore(match.away_score?.toString() || '');
                  setShowDialog(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Result
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Match Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">{selectedMatch?.home_flag}</div>
                  <div className="font-semibold">{selectedMatch?.home_team}</div>
                </div>
                <div className="text-2xl text-muted-foreground">vs</div>
                <div className="text-center">
                  <div className="text-3xl mb-2">{selectedMatch?.away_flag}</div>
                  <div className="font-semibold">{selectedMatch?.away_team}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Home Score</label>
                <Input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Away Score</label>
                <Input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This will update team statistics and recalculate standings automatically.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateResult}>Update Result</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
