import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase';
import { Users, Trophy, TrendingUp, Calendar, Plus } from 'lucide-react';

export default function TeamManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'team_manager') {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    try {
      // Get team managed by this user (match by email)
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('manager_email', user?.email)
        .single();

      setTeam(teamData);

      if (teamData) {
        // Get team players from database by team name (not team_id)
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('team', teamData.name)
          .order('name');

        setPlayers(playersData || []);

        // Get competition entries for this team
        const { data: entriesData } = await supabase
          .from('competition_entries')
          .select(`
            *,
            competition:competitions(name, season, status)
          `)
          .eq('team_id', teamData.id)
          .order('requested_at', { ascending: false });

        setEntries(entriesData || []);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppLayout><div className="p-8 text-center">Loading...</div></AppLayout>;
  }

  if (!team) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No team assigned to your account</p>
        </div>
      </AppLayout>
    );
  }

  const statusColors = {
    pending: 'bg-secondary/20 text-secondary-foreground',
    approved: 'bg-primary/20 text-primary',
    rejected: 'bg-destructive/20 text-destructive',
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Team Header */}
        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center text-5xl">
              {team.flag}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl">{team.name}</h1>
              <p className="text-muted-foreground">{team.country}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Manager: {team.manager_name} • {team.manager_email}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl text-primary">{team.points}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{team.played}</div>
            <div className="text-sm text-muted-foreground">Played</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{team.won}</div>
            <div className="text-sm text-muted-foreground">Won</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-2xl font-bold">{team.drawn}</div>
            <div className="text-sm text-muted-foreground">Drawn</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-2xl font-bold text-destructive">{team.lost}</div>
            <div className="text-sm text-muted-foreground">Lost</div>
          </div>
        </div>

        {/* Squad */}
        <div className="stat-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Squad ({players.length} players)
            </h2>
            <button
              onClick={() => navigate('/dashboard/players')}
              className="text-sm text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {players.slice(0, 6).map((player) => (
              <div key={player.id} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-xs text-muted-foreground">{player.position} • Age {player.age}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{player.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Entries */}
        <div className="stat-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Competition Entry Requests
            </h2>
            <button
              onClick={() => navigate('/dashboard/teams')}
              className="flex items-center gap-2 px-4 py-2 gradient-green text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Request Entry
            </button>
          </div>
          {entries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-xl">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No competition entries yet</p>
              <p className="text-sm mt-1">Click "Request Entry" to join a competition</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{entry.competition?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.competition?.season} • {entry.competition?.status}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[entry.status]}`}>
                      {entry.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Requested: {new Date(entry.requested_at).toLocaleDateString()}
                  </div>
                  {entry.status === 'pending' && (
                    <div className="mt-2 p-2 bg-secondary/10 rounded text-xs text-secondary-foreground">
                      ⏳ Waiting for federation admin approval
                    </div>
                  )}
                  {entry.status === 'approved' && (
                    <div className="mt-2 p-2 bg-primary/10 rounded text-xs text-primary">
                      ✓ Approved - Your team can now participate!
                    </div>
                  )}
                  {entry.rejection_reason && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      <span className="font-medium">Rejected:</span> {entry.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
