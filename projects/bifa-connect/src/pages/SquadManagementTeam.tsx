import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Target } from 'lucide-react';

export default function SquadManagementTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'team_manager') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Get manager's team
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('manager_email', user?.email)
        .single();

      setTeam(teamData);

      if (teamData) {
        // Get only players for this team by team name
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('team', teamData.name)
          .order('name');

        setPlayers(playersData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
        <div className="p-8 text-center text-muted-foreground">
          No team assigned to your account
        </div>
      </AppLayout>
    );
  }

  const positionGroups = {
    Forward: players.filter(p => p.position === 'Forward'),
    Midfielder: players.filter(p => p.position === 'Midfielder'),
    Defender: players.filter(p => p.position === 'Defender'),
    Goalkeeper: players.filter(p => p.position === 'Goalkeeper'),
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="stat-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-4xl">
              {team.flag}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl">{team.name} Squad</h1>
              <p className="text-muted-foreground">{players.length} Players</p>
            </div>
          </div>
        </div>

        {/* Squad by Position */}
        {Object.entries(positionGroups).map(([position, posPlayers]) => (
          posPlayers.length > 0 && (
            <div key={position} className="stat-card rounded-xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {position}s ({posPlayers.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {posPlayers.map((player) => (
                  <div key={player.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.flag} {player.country} • Age {player.age}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{player.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="font-bold text-primary">{player.goals || 0}</div>
                        <div className="text-xs text-muted-foreground">Goals</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="font-bold text-secondary">{player.assists || 0}</div>
                        <div className="text-xs text-muted-foreground">Assists</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {players.length === 0 && (
          <div className="stat-card rounded-xl p-8 text-center text-muted-foreground">
            No players in squad yet
          </div>
        )}
      </div>
    </AppLayout>
  );
}
