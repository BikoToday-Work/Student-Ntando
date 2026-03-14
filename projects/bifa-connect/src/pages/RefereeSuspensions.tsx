import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useReferees, useRefereeSuspensions, useCreateSuspension, useUpdateSuspensionStatus } from '@/hooks/useApi';
import { AlertTriangle, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function RefereeSuspensions() {
  const { user, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: referees = [] } = useReferees();
  const { data: suspensions = [], isLoading } = useRefereeSuspensions();
  const createSuspension = useCreateSuspension();
  const updateStatus = useUpdateSuspensionStatus();
  const canFile = hasPermission('manage_referees');
  const isReferee = user?.role === 'referee';

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    referee_id: '',
    reason: '',
    severity: 'medium',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.referee_id || !formData.reason || !formData.start_date) {
      toast({ title: t('error'), description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    createSuspension.mutate({
      ...formData,
      filed_by: user?.name || 'Federation Official',
      status: 'active'
    }, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ referee_id: '', reason: '', severity: 'medium', start_date: new Date().toISOString().split('T')[0], end_date: '', notes: '' });
      }
    });
  };

  const mySuspensions = isReferee ? suspensions.filter(s => s.referees?.name === user?.name) : [];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Referee Suspensions</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isReferee ? 'View your suspension status' : 'File and manage referee suspension reports'}
            </p>
          </div>
          {canFile && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 shadow-glow"
            >
              <FileText className="w-4 h-4" />
              File Suspension Report
            </button>
          )}
        </div>

        {/* Referee Alert */}
        {isReferee && mySuspensions.filter(s => s.status === 'active').length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">You are currently suspended</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You have {mySuspensions.filter(s => s.status === 'active').length} active suspension(s). 
                You cannot officiate matches during this period.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && canFile && (
          <div className="stat-card rounded-xl p-5">
            <h3 className="font-semibold mb-4">File Suspension Report</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Select Referee</label>
                <select
                  value={formData.referee_id}
                  onChange={e => setFormData({...formData, referee_id: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Referee --</option>
                  {referees.map(ref => (
                    <option key={ref.id} value={ref.id}>{ref.flag} {ref.name} ({ref.country})</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Reason for Suspension</label>
                <textarea
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Describe the incident or violation..."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Severity</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({...formData, severity: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="Any additional information..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSubmit}
                disabled={createSuspension.isPending}
                className="flex items-center gap-2 gradient-green text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {createSuspension.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Filing...</> : 'File Report'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-accent"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Suspensions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="stat-card rounded-xl p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : (isReferee ? mySuspensions : suspensions).length === 0 ? (
            <div className="stat-card rounded-xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isReferee ? 'No suspensions on your record' : 'No suspension reports filed'}
              </p>
            </div>
          ) : (
            (isReferee ? mySuspensions : suspensions).map(suspension => (
              <div key={suspension.id} className="stat-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      suspension.status === 'active' ? 'bg-destructive/20' : 
                      suspension.status === 'lifted' ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      {suspension.status === 'active' ? <AlertTriangle className="w-5 h-5 text-destructive" /> :
                       suspension.status === 'lifted' ? <CheckCircle className="w-5 h-5 text-primary" /> :
                       <Clock className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{suspension.referees?.flag} {suspension.referees?.name}</h3>
                      <p className="text-xs text-muted-foreground">{suspension.referees?.country}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      suspension.status === 'active' ? 'bg-destructive/20 text-destructive' :
                      suspension.status === 'lifted' ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {suspension.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      suspension.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                      suspension.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      suspension.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {suspension.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium mb-1">Reason:</p>
                  <p className="text-sm text-muted-foreground">{suspension.reason}</p>
                </div>

                {suspension.notes && (
                  <div className="bg-muted rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{suspension.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Filed by:</span> {suspension.filed_by}
                  </div>
                  <div>
                    <span className="font-medium">Start:</span> {new Date(suspension.start_date).toLocaleDateString()}
                  </div>
                  {suspension.end_date && (
                    <div>
                      <span className="font-medium">End:</span> {new Date(suspension.end_date).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Filed:</span> {new Date(suspension.created_at).toLocaleDateString()}
                  </div>
                </div>

                {canFile && suspension.status === 'active' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => updateStatus.mutate({ id: suspension.id, status: 'lifted' })}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Lift Suspension
                    </button>
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
