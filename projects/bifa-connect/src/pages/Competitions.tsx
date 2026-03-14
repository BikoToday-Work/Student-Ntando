import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { matches, competitions, teams } from '@/data/mockData';
import { useTimezone } from '@/context/TimezoneContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMatches, useCreateMatch } from '@/hooks/useApi';
import { supabase } from '@/lib/supabase';
import { Trophy, Calendar, MapPin, Users, Clock, Globe, Plus, Activity, Download, Upload, Filter, X, Loader2 } from 'lucide-react';

export default function Competitions() {
  const navigate = useNavigate();
  const { formatMatchTime, userTimezone } = useTimezone();
  const { t } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Use API data
  const { data: apiMatches = [], isLoading } = useMatches();
  const createMatchMutation = useCreateMatch();
  const [dbCompetitions, setDbCompetitions] = useState<any[]>([]);
  const [allCompetitions, setAllCompetitions] = useState<any[]>([]);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    const { data } = await supabase.from('competitions').select('*').order('created_at', { ascending: false });
    setDbCompetitions(data || []);
    setAllCompetitions([...competitions, ...(data || [])]);
  };

  const canManage = hasPermission('manage_competitions');
  const [activeComp, setActiveComp] = useState(allCompetitions[0]?.id || 'comp_001');
  const [viewMode, setViewMode] = useState<'schedule' | 'standings'>('schedule');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMatch, setNewMatch] = useState({
    home_team: '',
    away_team: '',
    kickoff_utc: '',
    venue: '',
    competition: ''
  });

  const currentComp = competitions.find(c => c.id === activeComp);

  // Filter matches for current competition
  // Note: API matches use snake_case (home_team), mock data used camelCase (homeTeam)
  const compMatches = apiMatches.filter(m => m.competition === currentComp?.name);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.home_team || !newMatch.away_team || !newMatch.kickoff_utc) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    createMatchMutation.mutate({
      competition: currentComp?.name || 'Unknown',
      round: 'Regular Season',
      home_team: newMatch.home_team,
      away_team: newMatch.away_team,
      home_flag: '🏳️',
      away_flag: '🏴',
      home_score: null,
      away_score: null,
      status: 'scheduled',
      kickoff_utc: new Date(newMatch.kickoff_utc).toISOString(),
      venue: newMatch.venue,
    });
    
    setShowCreateModal(false);
    setNewMatch({ home_team: '', away_team: '', kickoff_utc: '', venue: '', competition: '' });
  };

  const handleExportData = () => {
    toast({
      title: t('export'),
      description: 'Exporting competition data...',
    });
  };

  const statusColors = {
    scheduled: 'bg-muted text-muted-foreground',
    live: 'bg-destructive/20 text-destructive',
    completed: 'bg-primary/20 text-primary',
    postponed: 'bg-secondary/20 text-secondary-foreground',
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('competitions')}</h1>
            <p className="text-muted-foreground text-sm mt-1">League & match engine — cross-timezone scheduling</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 bg-muted hover:bg-accent text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('export')}
            </button>
            {(user?.role === 'federation_admin' || user?.role === 'super_admin') && (
              <button 
                onClick={() => navigate('/dashboard/create-competition')}
                className="flex items-center gap-2 gradient-gold text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
              >
                <Trophy className="w-4 h-4" />
                Create Competition
              </button>
            )}
            {canManage && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
              >
                <Plus className="w-4 h-4" />
                Create Match
              </button>
            )}
          </div>
        </div>

        {/* Create Match Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-semibold text-lg">Schedule New Match</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateMatch} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Home Team</label>
                    <select 
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                      value={newMatch.home_team}
                      onChange={e => setNewMatch({...newMatch, home_team: e.target.value})}
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Away Team</label>
                    <select 
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                      value={newMatch.away_team}
                      onChange={e => setNewMatch({...newMatch, away_team: e.target.value})}
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Kickoff Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    value={newMatch.kickoff_utc}
                    onChange={e => setNewMatch({...newMatch, kickoff_utc: e.target.value})}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Times entered in your local time ({userTimezone})</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Venue</label>
                  <input 
                    type="text" 
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="Stadium Name"
                    value={newMatch.venue}
                    onChange={e => setNewMatch({...newMatch, venue: e.target.value})}
                    required
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button 
                    type="submit" 
                    disabled={createMatchMutation.isPending}
                    className="flex-1 gradient-green text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createMatchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Match
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Competition selector */}
        <div className="grid md:grid-cols-3 gap-4">
          {allCompetitions.map(comp => (
            <button
              key={comp.id}
              onClick={() => setActiveComp(comp.id)}
              className={`stat-card rounded-xl p-4 text-left transition-all ${
                activeComp === comp.id ? 'border-primary border-glow' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${comp.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {comp.status}
                </span>
                <span className="text-xs text-muted-foreground">{comp.type}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{comp.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{comp.season}</p>
              {comp.description && <p className="text-xs text-muted-foreground mb-2">{comp.description.slice(0, 60)}...</p>}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded-lg px-2 py-1 text-center">
                  <div className="font-bold text-primary">{comp.teams || comp.total_teams || 0}</div>
                  <div className="text-muted-foreground">Teams</div>
                </div>
                <div className="bg-muted rounded-lg px-2 py-1 text-center">
                  <div className="font-bold text-secondary">{comp.prize || comp.competition_type || 'N/A'}</div>
                  <div className="text-muted-foreground">{comp.prize ? 'Prize' : 'Type'}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Competition detail */}
        {currentComp && (
          <div className="stat-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">{currentComp.name}</h2>
                <p className="text-xs text-muted-foreground">Host: {currentComp.hostCountry} • {currentComp.matches} matches</p>
              </div>
              <div className="flex gap-2">
                {(['schedule', 'standings'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      viewMode === v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {viewMode === 'schedule' && (
              <div className="space-y-3">
                {/* Timezone demonstration banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Timezone Engine Demo</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All kickoff times stored internally as <span className="font-mono text-primary">UTC ISO 8601</span>. 
                    Currently displaying in: <span className="font-semibold text-foreground">{userTimezone}</span>. 
                    Use the timezone selector (top bar) to switch between BRICS+ zones and see times auto-convert.
                  </p>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading matches...</div>
                ) : compMatches.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-xl">
                    No matches scheduled. Click "Create Match" to add one.
                  </div>
                ) : compMatches.map(match => {
                  // Handle both snake_case (API) and camelCase (Mock) properties safely
                  const kickoff = match.kickoff_utc || match.kickoffUtc;
                  const homeTeam = match.home_team || match.homeTeam;
                  const awayTeam = match.away_team || match.awayTeam;
                  const homeScore = match.home_score ?? match.homeScore;
                  const awayScore = match.away_score ?? match.awayScore;
                  const homeFlag = match.home_flag || match.homeFlag;
                  const awayFlag = match.away_flag || match.awayFlag;
                  const venue = match.venue;
                  const venueCountry = match.venue_country || match.venueCountry;
                  const refereeName = match.referee_name || match.refereeName;
                  const venueTimezone = match.venue_timezone || match.venueTimezone;

                  const time = formatMatchTime(kickoff);
                  const venueTime = formatMatchTime(kickoff, venueTimezone);
                  
                  return (
                    <div key={match.id} className={`border rounded-xl p-4 ${match.status === 'live' ? 'border-destructive/30 bg-destructive/5' : 'border-border hover:border-primary/20'} transition-colors`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[match.status]}`}>
                            {match.status === 'live' ? '🔴 LIVE' : match.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{match.round}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>Ref: {refereeName || 'TBD'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <div className="text-3xl mb-1">{homeFlag}</div>
                          <div className="font-semibold">{homeTeam}</div>
                        </div>
                        <div className="px-6 text-center">
                          {match.status === 'completed' || match.status === 'live' ? (
                            <div className="font-display text-4xl text-primary">{homeScore} – {awayScore}</div>
                          ) : (
                            <div className="text-muted-foreground font-semibold text-xl">VS</div>
                          )}
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-3xl mb-1">{awayFlag}</div>
                          <div className="font-semibold">{awayTeam}</div>
                        </div>
                      </div>

                      {/* Cross-timezone display */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs bg-muted/50 rounded-lg p-3">
                        <div>
                          <div className="text-muted-foreground mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />Your Local Time</div>
                          <div className="font-mono font-bold text-primary">{time.time}</div>
                          <div className="text-muted-foreground">{time.date}</div>
                          <div className="text-muted-foreground/70 text-xs">{time.timezone}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-0.5 flex items-center gap-1"><Globe className="w-3 h-3" />UTC (Stored)</div>
                          <div className="font-mono font-bold">{time.utc}</div>
                          <div className="font-mono text-muted-foreground text-xs">{time.iso8601}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />Venue Local ({venueCountry})</div>
                          <div className="font-mono font-bold">{venueTime.time}</div>
                          <div className="text-muted-foreground">{venueTime.date}</div>
                          <div className="text-muted-foreground/70 text-xs">{venueTime.timezone}</div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {venue}, {venueCountry}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'standings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                      {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form'].map(h => (
                        <th key={h} className={`pb-3 ${h === 'Team' ? 'text-left' : 'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, i) => (
                      <tr key={team.id} className="border-b border-border/50 table-row-hover transition-colors">
                        <td className="py-3 text-center text-muted-foreground text-xs font-semibold">
                          {i < 2 ? <span className="text-primary">{i + 1}</span> : i + 1}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{team.flag}</span>
                            <div>
                              <div className="font-semibold">{team.name}</div>
                              <div className="text-xs text-muted-foreground">{team.country}</div>
                            </div>
                          </div>
                        </td>
                        {[team.played, team.won, team.drawn, team.lost, team.goalsFor, team.goalsAgainst].map((v, vi) => (
                          <td key={vi} className="py-3 text-center">{v}</td>
                        ))}
                        <td className={`py-3 text-center font-medium ${team.goalsFor - team.goalsAgainst > 0 ? 'text-primary' : team.goalsFor - team.goalsAgainst < 0 ? 'text-destructive' : ''}`}>
                          {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                        </td>
                        <td className="py-3 text-center font-bold text-primary text-lg">{team.points}</td>
                        <td className="py-3">
                          <div className="flex gap-0.5 justify-center">
                            {team.form.slice(-5).map((f, fi) => (
                              <span key={fi} className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center text-white ${f === 'W' ? 'bg-primary' : f === 'D' ? 'bg-muted-foreground' : 'bg-destructive'}`}>{f}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
