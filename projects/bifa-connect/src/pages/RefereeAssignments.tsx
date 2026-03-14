import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useRefereeAssignments, useRespondToAssignment } from '@/hooks/useApi';
import { useTimezone } from '@/context/TimezoneContext';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, AlertCircle } from 'lucide-react';

export default function RefereeAssignments() {
  const { user } = useAuth();
  const { formatMatchTime } = useTimezone();
  const { data: assignments = [], isLoading } = useRefereeAssignments(user?.id);
  const respondMutation = useRespondToAssignment();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [notes, setNotes] = useState('');

  const handleRespond = (assignmentId: string, status: 'accepted' | 'declined') => {
    respondMutation.mutate({ assignmentId, status, notes: notes || undefined });
    setSelectedAssignment(null);
    setNotes('');
  };

  const pendingAssignments = assignments.filter((a: any) => a.assignment_status === 'pending');
  const respondedAssignments = assignments.filter((a: any) => a.assignment_status !== 'pending');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-3xl">Match Assignments</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and respond to your match assignments</p>
        </div>

        {/* Pending Assignments */}
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Pending Assignments ({pendingAssignments.length})
          </h2>
          {pendingAssignments.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center text-muted-foreground">
              No pending assignments
            </div>
          ) : (
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
                      {formatMatchTime(assignment.matches.kickoff_utc)}
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
          )}
        </div>

        {/* Responded Assignments */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Assignment History</h2>
          <div className="space-y-3">
            {respondedAssignments.map((assignment: any) => (
              <div key={assignment.id} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">
                      {assignment.matches.home_team} vs {assignment.matches.away_team}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatMatchTime(assignment.matches.kickoff_utc)} • {assignment.matches.venue}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    assignment.assignment_status === 'accepted' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-destructive/20 text-destructive'
                  }`}>
                    {assignment.assignment_status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </AppLayout>
  );
}
