import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Trophy, CheckCircle, XCircle, Clock, ArrowLeft, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createNotification } from '@/lib/notifications';

interface CompetitionEntry {
  id: string;
  competition_id: string;
  team_id: string;
  status: string;
  requested_at: string;
  rejection_reason?: string;
  team?: { name: string; country: string; flag: string };
}

export default function CompetitionEntries() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<CompetitionEntry[]>([]);
  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: comp } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single();
      
      setCompetition(comp);

      const { data: entriesData, error } = await supabase
        .from('competition_entries')
        .select(`
          *,
          team:teams(name, country, flag)
        `)
        .eq('competition_id', id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setEntries(entriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entryId: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      
      const { error } = await supabase
        .from('competition_entries')
        .update({
          status: 'approved',
          reviewed_by: null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', entryId);

      if (error) throw error;

      // Get team manager details
      const { data: teamData } = await supabase
        .from('teams')
        .select('manager_email, manager_name')
        .eq('id', entry?.team_id)
        .single();

      // Send notification to team manager
      if (teamData?.manager_email) {
        await createNotification(
          teamData.manager_email,
          'Competition Entry Approved',
          `Your team ${entry?.team?.name} has been approved for ${competition?.name} - ${competition?.season}`,
          'success',
          '/dashboard/team-manager'
        );
      }

      alert('Entry approved!');
      loadData();
    } catch (error: any) {
      console.error('Error approving:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleReject = async (entryId: string) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;

    try {
      const entry = entries.find(e => e.id === entryId);
      
      const { error } = await supabase
        .from('competition_entries')
        .update({
          status: 'rejected',
          reviewed_by: null,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', entryId);

      if (error) throw error;

      // Get team manager details
      const { data: teamData } = await supabase
        .from('teams')
        .select('manager_email, manager_name')
        .eq('id', entry?.team_id)
        .single();

      // Send notification to team manager
      if (teamData?.manager_email) {
        await createNotification(
          teamData.manager_email,
          'Competition Entry Rejected',
          `Your team ${entry?.team?.name} entry was rejected for ${competition?.name} - ${competition?.season}. Reason: ${reason}`,
          'error',
          '/dashboard/team-manager'
        );
      }

      alert('Entry rejected');
      loadData();
    } catch (error: any) {
      console.error('Error rejecting:', error);
      alert('Error: ' + error.message);
    }
  };

  const statusColors = {
    pending: 'bg-secondary/20 text-secondary-foreground',
    approved: 'bg-primary/20 text-primary',
    rejected: 'bg-destructive/20 text-destructive',
  };

  if (loading) return <AppLayout><div className="p-8 text-center">Loading...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/competitions')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-3xl flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Competition Entries
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {competition?.name} - {competition?.season}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {entries.length === 0 ? (
            <div className="stat-card rounded-xl p-8 text-center text-muted-foreground">
              No team entries yet
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="stat-card rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{entry.team?.flag}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{entry.team?.name}</h3>
                      <p className="text-sm text-muted-foreground">{entry.team?.country}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested: {new Date(entry.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[entry.status]}`}>
                      {entry.status}
                    </span>

                    {entry.status === 'pending' && user?.role === 'federation_admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(entry.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(entry.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {entry.rejection_reason && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded-lg text-sm">
                    <span className="font-medium">Rejection reason:</span> {entry.rejection_reason}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
