import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase';
import { ArrowRightLeft, ArrowRight } from 'lucide-react';

export default function PlayerTransferTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [transfers, setTransfers] = useState<any[]>([]);
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
        // Get transfers involving this team (incoming or outgoing)
        // Note: We need to handle the case where team_id might be null
        const { data: transfersData } = await supabase
          .from('player_transfers')
          .select('*')
          .or(`from_team_id.eq.${teamData.id},to_team_id.eq.${teamData.id}`)
          .order('transfer_date', { ascending: false });

        // Enrich with player and team data
        if (transfersData) {
          const enrichedTransfers = await Promise.all(
            transfersData.map(async (transfer) => {
              const { data: player } = await supabase
                .from('players')
                .select('name, position, country, flag')
                .eq('id', transfer.player_id)
                .single();

              const { data: fromTeam } = transfer.from_team_id
                ? await supabase.from('teams').select('name, flag').eq('id', transfer.from_team_id).single()
                : { data: null };

              const { data: toTeam } = transfer.to_team_id
                ? await supabase.from('teams').select('name, flag').eq('id', transfer.to_team_id).single()
                : { data: null };

              return {
                ...transfer,
                player,
                from_team: fromTeam,
                to_team: toTeam,
              };
            })
          );
          setTransfers(enrichedTransfers);
        }
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

  const statusColors = {
    pending: 'bg-secondary/20 text-secondary-foreground',
    approved: 'bg-primary/20 text-primary',
    completed: 'bg-primary/20 text-primary',
    rejected: 'bg-destructive/20 text-destructive',
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
              <h1 className="font-display text-3xl flex items-center gap-3">
                <ArrowRightLeft className="w-8 h-8 text-primary" />
                Transfer History
              </h1>
              <p className="text-muted-foreground">{team.name} - All incoming and outgoing transfers</p>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        <div className="space-y-3">
          {transfers.length === 0 ? (
            <div className="stat-card rounded-xl p-8 text-center text-muted-foreground">
              No transfers yet
            </div>
          ) : (
            transfers.map((transfer) => {
              const isIncoming = transfer.to_team_id === team.id;
              const isOutgoing = transfer.from_team_id === team.id;

              return (
                <div key={transfer.id} className="stat-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isIncoming ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                      }`}>
                        {isIncoming ? 'INCOMING' : 'OUTGOING'}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[transfer.status]}`}>
                        {transfer.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transfer.transfer_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{transfer.player?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {transfer.player?.flag} {transfer.player?.country} • {transfer.player?.position}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-right">
                        <div className="font-medium">{transfer.from_team?.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">From</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{transfer.to_team?.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">To</div>
                      </div>
                    </div>
                  </div>

                  {transfer.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-xs">
                      <span className="font-medium">Notes:</span> {transfer.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
