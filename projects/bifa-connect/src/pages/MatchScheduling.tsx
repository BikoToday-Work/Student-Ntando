import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTimezone } from '@/context/TimezoneContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar, Plus, AlertCircle } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  country: string;
  flag: string;
}

interface Competition {
  id: string;
  name: string;
  type: string;
}

export default function MatchScheduling() {
  const { user } = useAuth();
  const { toUTC } = useTimezone();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    competition_id: '',
    home_team_id: '',
    away_team_id: '',
    venue: '',
    venue_country: '',
    venue_timezone: 'Africa/Johannesburg',
    kickoff_date: '',
    kickoff_time: '',
    round: '',
  });

  useEffect(() => {
    fetchCompetitions();
    fetchTeams();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const { data, error } = await supabase.from('competitions').select('*').eq('status', 'active');
      if (error) throw error;
      setCompetitions(data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      // Use mock data if database fails
      setCompetitions([
        { id: 'comp_001', name: 'BIFA Champions Cup 2026', type: 'Club' },
        { id: 'comp_002', name: 'BIFA U-23 League 2026', type: 'Club' },
      ]);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('teams').select('*');
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

  const checkConflicts = async () => {
    const kickoffUtc = toUTC(`${formData.kickoff_date}T${formData.kickoff_time}`, formData.venue_timezone);
    const conflictList: string[] = [];

    // Check home team availability
    const { data: homeMatches } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${formData.home_team_id},away_team_id.eq.${formData.home_team_id}`)
      .gte('kickoff_utc', new Date(new Date(kickoffUtc).getTime() - 48 * 60 * 60 * 1000).toISOString())
      .lte('kickoff_utc', new Date(new Date(kickoffUtc).getTime() + 48 * 60 * 60 * 1000).toISOString());

    if (homeMatches && homeMatches.length > 0) {
      conflictList.push('Home team has a match within 48 hours');
    }

    // Check away team availability
    const { data: awayMatches } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${formData.away_team_id},away_team_id.eq.${formData.away_team_id}`)
      .gte('kickoff_utc', new Date(new Date(kickoffUtc).getTime() - 48 * 60 * 60 * 1000).toISOString())
      .lte('kickoff_utc', new Date(new Date(kickoffUtc).getTime() + 48 * 60 * 60 * 1000).toISOString());

    if (awayMatches && awayMatches.length > 0) {
      conflictList.push('Away team has a match within 48 hours');
    }

    setConflicts(conflictList);
    return conflictList.length === 0;
  };

  const handleSchedule = async () => {
    if (!formData.competition_id || !formData.home_team_id || !formData.away_team_id) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.home_team_id === formData.away_team_id) {
      toast.error('Home and away teams must be different');
      return;
    }

    const noConflicts = await checkConflicts();
    if (!noConflicts && conflicts.length > 0) {
      toast.warning('Scheduling conflicts detected. Review before proceeding.');
    }

    try {
      const kickoffUtc = toUTC(`${formData.kickoff_date}T${formData.kickoff_time}`, formData.venue_timezone);
      const homeTeam = teams.find(t => t.id === formData.home_team_id);
      const awayTeam = teams.find(t => t.id === formData.away_team_id);

      const { error } = await supabase.from('matches').insert({
        competition_id: formData.competition_id,
        home_team: homeTeam?.name,
        away_team: awayTeam?.name,
        home_team_id: formData.home_team_id,
        away_team_id: formData.away_team_id,
        home_flag: homeTeam?.flag,
        away_flag: awayTeam?.flag,
        venue: formData.venue,
        venue_country: formData.venue_country,
        venue_timezone: formData.venue_timezone,
        kickoff_utc: kickoffUtc,
        round: formData.round,
        status: 'scheduled',
      });

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'MATCH_SCHEDULED',
        module: 'Competitions',
        details: `Scheduled ${homeTeam?.name} vs ${awayTeam?.name}`,
      });

      toast.success('Match scheduled successfully');
      setShowDialog(false);
      setFormData({
        competition_id: '',
        home_team_id: '',
        away_team_id: '',
        venue: '',
        venue_country: '',
        venue_timezone: 'Africa/Johannesburg',
        kickoff_date: '',
        kickoff_time: '',
        round: '',
      });
    } catch (error) {
      console.error('Error scheduling match:', error);
      toast.error('Failed to schedule match');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Match Scheduling</h1>
          <p className="text-muted-foreground">Schedule competition matches</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Match
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Match</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Competition</label>
                <Select value={formData.competition_id} onValueChange={(v) => setFormData({...formData, competition_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Round</label>
                <Input
                  placeholder="e.g., Group Stage - MD1"
                  value={formData.round}
                  onChange={(e) => setFormData({...formData, round: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Home Team</label>
                <Select value={formData.home_team_id} onValueChange={(v) => setFormData({...formData, home_team_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.flag} {t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Away Team</label>
                <Select value={formData.away_team_id} onValueChange={(v) => setFormData({...formData, away_team_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.flag} {t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Venue</label>
                <Input
                  placeholder="Stadium name"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Venue Country</label>
                <Input
                  placeholder="Country"
                  value={formData.venue_country}
                  onChange={(e) => setFormData({...formData, venue_country: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kickoff Date</label>
                <Input
                  type="date"
                  value={formData.kickoff_date}
                  onChange={(e) => setFormData({...formData, kickoff_date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Kickoff Time</label>
                <Input
                  type="time"
                  value={formData.kickoff_time}
                  onChange={(e) => setFormData({...formData, kickoff_time: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Venue Timezone</label>
                <Select value={formData.venue_timezone} onValueChange={(v) => setFormData({...formData, venue_timezone: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">🇧🇷 São Paulo</SelectItem>
                    <SelectItem value="Europe/Moscow">🇷🇺 Moscow</SelectItem>
                    <SelectItem value="Asia/Kolkata">🇮🇳 Kolkata</SelectItem>
                    <SelectItem value="Asia/Shanghai">🇨🇳 Shanghai</SelectItem>
                    <SelectItem value="Africa/Johannesburg">🇿🇦 Johannesburg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {conflicts.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Scheduling Conflicts</p>
                    <ul className="text-sm text-destructive/80 mt-1 space-y-1">
                      {conflicts.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>Schedule Match</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
