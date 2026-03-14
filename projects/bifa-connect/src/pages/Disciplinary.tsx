import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useRefereeSuspensions, useCreateSuspension } from '@/hooks/useApi';
import { useReferees } from '@/hooks/useApi';
import { AlertCircle, Shield, Lock, FileText, Clock, CheckCircle2, Scale, Plus, AlertTriangle, Gavel, Search } from 'lucide-react';

const severityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-secondary/20 text-secondary-foreground',
  high: 'bg-destructive/10 text-destructive',
  critical: 'bg-destructive text-destructive-foreground',
};

const statusColors = {
  pending: 'bg-secondary/20 text-secondary-foreground',
  evidence_requested: 'bg-primary/20 text-primary',
  hearing_scheduled: 'bg-primary/20 text-primary',
  sanction_applied: 'bg-destructive/20 text-destructive',
  resolved: 'bg-primary/10 text-primary',
};

export default function Disciplinary() {
  const { user, hasPermission } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: suspensions = [], isLoading } = useRefereeSuspensions();
  const { data: referees = [] } = useReferees();
  const createSuspension = useCreateSuspension();
  const canManage = hasPermission('manage_disciplinary') || hasPermission('manage_referees');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string>('');

  const selected = suspensions.find(c => c.id === selectedCase);

  const handleAction = (action: string) => {
    if (!selected) return;

    if (action === 'sanction') {
      toast({ title: 'Success', description: 'Sanction applied to case' });
    } else if (action === 'evidence') {
      toast({ title: 'Success', description: 'Evidence request sent' });
    } else if (action === 'hearing') {
      toast({ title: 'Success', description: 'Hearing scheduled' });
    }
    setActionType('');
  };

  const stats = [
    { label: 'Total Cases', value: suspensions.length, color: 'foreground' },
    { label: 'Active', value: suspensions.filter(c => c.status === 'active').length, color: 'destructive' },
    { label: 'Pending Review', value: suspensions.filter(c => c.status === 'pending').length, color: 'secondary' },
    { label: 'Resolved', value: suspensions.filter(c => c.status === 'lifted').length, color: 'primary' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">{t('disciplinary')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Disciplinary cases and referee suspensions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="stat-card rounded-xl p-4 text-center">
              <div className={`font-display text-3xl text-${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cases list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Suspension Cases</h3>
            {isLoading ? (
              <div className="stat-card rounded-xl p-8 text-center">Loading...</div>
            ) : suspensions.length === 0 ? (
              <div className="stat-card rounded-xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">No disciplinary cases</p>
              </div>
            ) : (
              suspensions.map(dc => (
                <button
                  key={dc.id}
                  onClick={() => setSelectedCase(selectedCase === dc.id ? null : dc.id)}
                  className={`w-full stat-card rounded-xl p-4 text-left transition-all ${selectedCase === dc.id ? 'border-primary border-glow' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{dc.referees?.flag}</span>
                      <span className="font-semibold text-sm">{dc.referees?.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[dc.status] || statusColors.pending}`}>
                      {dc.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{dc.reason}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[dc.severity]}`}>{dc.severity}</span>
                    <span className="text-xs text-muted-foreground">{new Date(dc.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Case detail */}
          {selected ? (
            <div className="stat-card rounded-xl p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Case Details</h2>
                <span className="text-xs font-mono text-muted-foreground">#{selected.id.slice(0, 8)}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Referee</div>
                  <div className="font-semibold">{selected.referees?.flag} {selected.referees?.name}</div>
                  <div className="text-sm text-muted-foreground">{selected.referees?.country}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reason</div>
                  <div className="text-sm bg-muted rounded-lg p-3">{selected.reason}</div>
                </div>

                {selected.notes && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</div>
                    <div className="text-sm bg-muted rounded-lg p-3">{selected.notes}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Severity</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[selected.severity]}`}>{selected.severity}</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status] || statusColors.pending}`}>{selected.status}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Filed By</div>
                  <div className="text-sm">{selected.filed_by}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Start Date</div>
                    <div className="text-sm">{new Date(selected.start_date).toLocaleDateString()}</div>
                  </div>
                  {selected.end_date && (
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">End Date</div>
                      <div className="text-sm">{new Date(selected.end_date).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>

                {canManage && selected.status === 'active' && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Admin Actions</div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleAction('sanction')}
                        className="text-xs gradient-green text-primary-foreground px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 flex items-center gap-1"
                      >
                        <Gavel className="w-3 h-3" />
                        Apply Sanction
                      </button>
                      <button 
                        onClick={() => handleAction('evidence')}
                        className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/20 flex items-center gap-1"
                      >
                        <Search className="w-3 h-3" />
                        Request Evidence
                      </button>
                      <button 
                        onClick={() => handleAction('hearing')}
                        className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-lg hover:text-foreground flex items-center gap-1"
                      >
                        <Scale className="w-3 h-3" />
                        Schedule Hearing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="stat-card rounded-xl p-5 flex items-center justify-center text-center">
              <div>
                <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">Select a case to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
