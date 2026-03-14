import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { teams, players } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, Users, TrendingUp, Plus, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Teams() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [dbTeams, setDbTeams] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedComp, setSelectedComp] = useState<string>('');
  const [myTeam, setMyTeam] = useState<any>(null);

  useEffect(() => {
    loadCompetitions();
    loadTeams();
    if (user?.role === 'team_manager') {
      loadMyTeam();
    }
  }, [user]);

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select('*');
    setDbTeams(data || []);
  };

  const loadMyTeam = async () => {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('manager_email', user?.email)
      .single();
    setMyTeam(data);
    if (data) setSelectedTeam(data.id);
  };

  const loadCompetitions = async () => {
    const { data } = await supabase.from('competitions').select('*').order('created_at', { ascending: false });
    setCompetitions(data || []);
  };

  const handleRequestEntry = async () => {
    if (!selectedComp) {
      alert('Please select a competition');
      return;
    }

    if (!myTeam) {
      alert('No team found for your account');
      return;
    }

    try {
      const { data: existing, error: checkError } = await supabase
        .from('competition_entries')
        .select('id, status')
        .eq('competition_id', selectedComp)
        .eq('team_id', myTeam.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        alert(`Entry already exists with status: ${existing.status}`);
        setShowRequestModal(false);
        return;
      }

      const { error } = await supabase
        .from('competition_entries')
        .insert([{
          competition_id: selectedComp,
          team_id: myTeam.id,
          requested_by: null,
          status: 'pending',
        }]);

      if (error) throw error;
      alert('Entry request submitted!');
      setShowRequestModal(false);
      setSelectedComp('');
    } catch (error: any) {
      console.error('Request error:', error);
      alert('Error: ' + error.message);
    }
  };
  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('teams')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Club & national team management across BRICS+ nations</p>
          </div>
          {user?.role === 'team_manager' && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
            >
              <Trophy className="w-4 h-4" />
              Request Competition Entry
            </button>
          )}
        </div>

        {/* Request Entry Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-lg">Request Competition Entry</h3>
              </div>
              <div className="p-5 space-y-4">
                {myTeam && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-primary">Your Team</div>
                    <div className="text-lg font-semibold mt-1">{myTeam.flag} {myTeam.name}</div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Competition</label>
                  <select
                    value={selectedComp}
                    onChange={(e) => setSelectedComp(e.target.value)}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg"
                  >
                    <option value="">Choose competition...</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.season})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleRequestEntry}
                    className="flex-1 gradient-green text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 bg-muted rounded-lg hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, i) => {
            const teamPlayers = players.filter(p => p.teamId === team.id);
            const gd = team.goalsFor - team.goalsAgainst;
            return (
              <div key={team.id} className="stat-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-3xl">{team.flag}</div>
                    <div>
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-xs text-muted-foreground">{team.country} • {team.league}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-primary">{team.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[{ label: 'W', value: team.won, color: 'primary' }, { label: 'D', value: team.drawn, color: 'muted-foreground' }, { label: 'L', value: team.lost, color: 'destructive' }, { label: 'GD', value: (gd >= 0 ? '+' : '') + gd, color: gd >= 0 ? 'primary' : 'destructive' }].map((s, si) => (
                    <div key={si} className="bg-muted rounded-lg p-2 text-center">
                      <div className={`font-bold text-${s.color}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                  <span>Manager: <span className="text-foreground font-medium">{team.manager}</span></span>
                  <span>{teamPlayers.length} tracked players</span>
                </div>
                <div className="flex gap-0.5">
                  {team.form.map((f, fi) => (
                    <span key={fi} className={`flex-1 h-1.5 rounded ${f === 'W' ? 'bg-primary' : f === 'D' ? 'bg-muted-foreground' : 'bg-destructive'}`}></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
