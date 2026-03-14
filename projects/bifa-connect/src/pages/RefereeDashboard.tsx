import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useRefereeAssignments, useRespondToAssignment, useMatchReports, useCreateMatchReport, useSubmitMatchReport, useRefereeByEmail } from '@/hooks/useApi';
import { useTimezone } from '@/context/TimezoneContext';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, AlertCircle, FileText, Send, Plus, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function RefereeDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatMatchTime } = useTimezone();
  const { data: refereeProfile, isLoading: loadingProfile } = useRefereeByEmail(user?.email);
  const refereeId = refereeProfile?.id;
  
  const { data: assignments = [], isLoading: loadingAssignments } = useRefereeAssignments(refereeId);
  const { data: reports = [], isLoading: loadingReports } = useMatchReports(refereeId);
  const respondMutation = useRespondToAssignment();
  const createReportMutation = useCreateMatchReport();
  const submitReportMutation = useSubmitMatchReport();
  
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [reportData, setReportData] = useState({
    match_id: '',
    match_summary: '',
    incidents: '',
    yellow_cards: 0,
    red_cards: 0,
    penalties: 0,
    injuries: '',
    additional_notes: ''
  });

  const handleRespond = (assignmentId: string, status: 'accepted' | 'declined') => {
    respondMutation.mutate({ assignmentId, status, notes: notes || undefined });
    setSelectedAssignment(null);
    setNotes('');
  };

  const handleCreateReport = (matchId: string) => {
    setReportData({ ...reportData, match_id: matchId });
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    createReportMutation.mutate({
      ...reportData,
      referee_id: refereeId,
      report_status: 'submitted',
      submitted_at: new Date().toISOString()
    });
    setShowReportModal(false);
    setReportData({ match_id: '', match_summary: '', incidents: '', yellow_cards: 0, red_cards: 0, penalties: 0, injuries: '', additional_notes: '' });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (passwordData.new.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    
    const { error } = await supabase.from('referees').update({ password: passwordData.new }).eq('id', refereeId);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to update password', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Password updated successfully' });
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    }
  };

  const pendingAssignments = assignments.filter((a: any) => a.assignment_status === 'pending');
  const acceptedAssignments = assignments.filter((a: any) => a.assignment_status === 'accepted');

  if (loadingProfile || loadingAssignments || loadingReports) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!refereeProfile) {
    return (
      <AppLayout>
        <div className="space-y-6 max-w-6xl">
          <div className="glass rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h2 className="font-semibold text-lg mb-2 text-center">Referee Profile Not Found</h2>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Your account ({user?.email}) is not linked to a referee profile.
            </p>
            <div className="bg-muted rounded-lg p-4 text-xs space-y-2">
              <p className="font-semibold">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Ask an admin to register you as a referee</li>
                <li>Make sure they use your email: <span className="font-mono text-primary">{user?.email}</span></li>
                <li>Refresh this page after registration</li>
              </ol>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Referee Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your assignments and submit match reports</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 bg-muted hover:bg-accent px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pending</div>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Accepted</div>
            <div className="text-2xl font-bold">{acceptedAssignments.length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reports Submitted</div>
            <div className="text-2xl font-bold">{reports.filter((r: any) => r.report_status === 'submitted').length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Matches</div>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </div>
        </div>

        {/* Pending Assignments */}
        {pendingAssignments.length > 0 ? (
          <div>
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pending Assignments ({pendingAssignments.length})
            </h2>
            <div className="space-y-3">
              {pendingAssignments.map((assignment: any) => (
                <div key={assignment.id} className="glass rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-lg">
                        {assignment.matches.home_team} vs {assignment.matches.away_team}
                      </div>
                      <div className="text-sm text-muted-foreground">{assignment.matches.competition}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      Pending Response
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatMatchTime(assignment.matches.kickoff_utc).time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {assignment.matches.venue}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespond(assignment.id, 'accepted')}
                      disabled={respondMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      disabled={respondMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-destructive/20 text-destructive py-2 rounded-lg font-semibold hover:bg-destructive/30 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No Match Assignments Yet</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any match assignments at the moment. Check back later or contact the match coordinator.
            </p>
          </div>
        ) : null}

        {/* Accepted Assignments - Awaiting Reports */}
        {acceptedAssignments.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Upcoming Matches ({acceptedAssignments.length})
            </h2>
            <div className="space-y-3">
              {acceptedAssignments.map((assignment: any) => {
                const hasReport = reports.some((r: any) => r.match_id === assignment.match_id);
                return (
                  <div key={assignment.id} className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">
                          {assignment.matches.home_team} vs {assignment.matches.away_team}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatMatchTime(assignment.matches.kickoff_utc).time} • {assignment.matches.venue}
                        </div>
                      </div>
                      {!hasReport && (
                        <button
                          onClick={() => handleCreateReport(assignment.match_id)}
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90"
                        >
                          <Plus className="w-4 h-4" />
                          Submit Report
                        </button>
                      )}
                      {hasReport && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          Report Submitted
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Match Reports */}
        {reports.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-3">My Match Reports</h2>
            <div className="space-y-3">
              {reports.map((report: any) => (
                <div key={report.id} className="glass rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">
                        {report.matches.home_team} vs {report.matches.away_team}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatMatchTime(report.matches.kickoff_utc).time}
                      </div>
                      <div className="text-sm mt-2 text-muted-foreground">
                        Yellow: {report.yellow_cards} • Red: {report.red_cards} • Penalties: {report.penalties}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.report_status === 'reviewed' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary-foreground'
                    }`}>
                      {report.report_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decline Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-lg">Decline Assignment</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-destructive mb-1">Declining Match Assignment</div>
                    <div className="text-muted-foreground">
                      {selectedAssignment.matches.home_team} vs {selectedAssignment.matches.away_team}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Provide a reason for declining..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedAssignment(null); setNotes(''); }}
                    className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond(selectedAssignment.id, 'declined')}
                    disabled={respondMutation.isPending}
                    className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-border sticky top-0 bg-card">
                <h3 className="font-semibold text-lg">Submit Match Report</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Match Summary</label>
                  <textarea
                    value={reportData.match_summary}
                    onChange={e => setReportData({...reportData, match_summary: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Overall match summary..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Yellow Cards</label>
                    <input
                      type="number"
                      min="0"
                      value={reportData.yellow_cards}
                      onChange={e => setReportData({...reportData, yellow_cards: parseInt(e.target.value) || 0})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Red Cards</label>
                    <input
                      type="number"
                      min="0"
                      value={reportData.red_cards}
                      onChange={e => setReportData({...reportData, red_cards: parseInt(e.target.value) || 0})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Penalties</label>
                    <input
                      type="number"
                      min="0"
                      value={reportData.penalties}
                      onChange={e => setReportData({...reportData, penalties: parseInt(e.target.value) || 0})}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Incidents</label>
                  <textarea
                    value={reportData.incidents}
                    onChange={e => setReportData({...reportData, incidents: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Describe any incidents..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Injuries</label>
                  <textarea
                    value={reportData.injuries}
                    onChange={e => setReportData({...reportData, injuries: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm min-h-[60px]"
                    placeholder="Any injuries during the match..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Additional Notes</label>
                  <textarea
                    value={reportData.additional_notes}
                    onChange={e => setReportData({...reportData, additional_notes: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm min-h-[60px]"
                    placeholder="Any other observations..."
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-muted text-foreground py-2.5 rounded-lg font-semibold hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={createReportMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 gradient-green text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-lg">Change Password</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setShowPasswordModal(false); setPasswordData({ current: '', new: '', confirm: '' }); }}
                    className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className="flex-1 gradient-green text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
