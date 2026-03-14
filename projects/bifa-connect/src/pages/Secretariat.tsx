import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useReferees, useMatches, useCreateNotification, useAssignReferee } from '@/hooks/useApi';
import { Briefcase, Plus, Bell, UserCheck, Loader2 } from 'lucide-react';

export default function Secretariat() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: referees = [] } = useReferees();
  const { data: matches = [] } = useMatches();
  const createNotification = useCreateNotification();
  const assignReferee = useAssignReferee();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    referee_id: '',
    referee_name: '',
    match_id: '',
    match_details: ''
  });

  const handleAssignReferee = () => {
    if (!formData.referee_id || !formData.match_id) {
      toast({ title: 'Error', description: 'Please select referee and match', variant: 'destructive' });
      return;
    }

    const selectedMatch = matches.find(m => m.id === formData.match_id);
    
    assignReferee.mutate(
      { matchId: formData.match_id, refereeId: formData.referee_id },
      {
        onSuccess: () => {
          createNotification.mutate({
            user_name: formData.referee_name,
            title: 'New Match Assignment',
            message: `You have been assigned to officiate: ${selectedMatch?.home_team} vs ${selectedMatch?.away_team}`,
            type: 'match_assignment',
            link: '/dashboard/referee-dashboard',
          });
          
          toast({ 
            title: 'Success', 
            description: `${formData.referee_name} has been assigned and notified` 
          });
          setShowForm(false);
          setFormData({ referee_id: '', referee_name: '', match_id: '', match_details: '' });
        }
      }
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('secretariat')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Task assignment, workflow tracking & referee assignments</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4" /> Assign Referee to Match
          </button>
        </div>

        {/* Assignment Form */}
        {showForm && (
          <div className="stat-card rounded-xl p-5 border border-primary/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Assign Referee to Match
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Select Referee
                </label>
                <select
                  value={formData.referee_id}
                  onChange={e => {
                    const ref = referees.find(r => r.id === e.target.value);
                    setFormData({
                      ...formData, 
                      referee_id: e.target.value,
                      referee_name: ref?.name || ''
                    });
                  }}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Referee --</option>
                  {referees.filter(r => r.status === 'active').map(ref => (
                    <option key={ref.id} value={ref.id}>
                      {ref.flag} {ref.name} ({ref.country}) - {ref.grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Select Match
                </label>
                <select
                  value={formData.match_id}
                  onChange={e => {
                    const match = matches.find(m => m.id === e.target.value);
                    setFormData({
                      ...formData, 
                      match_id: e.target.value,
                      match_details: match ? `${match.home_team} vs ${match.away_team}` : ''
                    });
                  }}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Match --</option>
                  {matches.filter(m => m.status === 'scheduled').map(match => (
                    <option key={match.id} value={match.id}>
                      {match.home_flag} {match.home_team} vs {match.away_team} {match.away_flag} - {new Date(match.kickoff_utc).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAssignReferee}
                disabled={assignReferee.isPending}
                className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {assignReferee.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</>
                ) : (
                  <><Bell className="w-4 h-4" /> Assign & Notify</>
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-accent"
              >
                {t('cancel')}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <Bell className="w-3 h-3" />
              The referee will receive an instant notification about this assignment
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="stat-card rounded-xl p-5">
          <h3 className="font-semibold mb-3">Referee Assignment System</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Assign referees to upcoming matches</p>
            <p>• Referees receive instant notifications</p>
            <p>• Assigned matches appear in referee's dashboard</p>
            <p>• Only active referees can be assigned</p>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="stat-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Active Referees</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {referees.filter(r => r.status === 'active').slice(0, 6).map(ref => (
              <div key={ref.id} className="bg-muted rounded-lg p-3 flex items-center gap-3">
                <div className="text-2xl">{ref.flag}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{ref.name}</div>
                  <div className="text-xs text-muted-foreground">{ref.country} • {ref.grade}</div>
                </div>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {ref.matches_officiated || 0} matches
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
