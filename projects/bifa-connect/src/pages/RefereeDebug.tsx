import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useRefereeByEmail, useRefereeAssignments, useMatchReports } from '@/hooks/useApi';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function RefereeDebug() {
  const { user } = useAuth();
  const { data: refereeProfile, isLoading: loadingProfile, error: profileError } = useRefereeByEmail(user?.email);
  const refereeId = refereeProfile?.id;
  const { data: assignments = [], isLoading: loadingAssignments, error: assignmentsError } = useRefereeAssignments(refereeId);
  const { data: reports = [], isLoading: loadingReports, error: reportsError } = useMatchReports(refereeId);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-3xl">Referee Debug Info</h1>
          <p className="text-muted-foreground text-sm mt-1">Diagnostic information for troubleshooting</p>
        </div>

        {/* User Info */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold mb-3">User Account</h3>
          <div className="space-y-2 text-sm font-mono">
            <div><span className="text-muted-foreground">Email:</span> {user?.email}</div>
            <div><span className="text-muted-foreground">Name:</span> {user?.name}</div>
            <div><span className="text-muted-foreground">Role:</span> {user?.role}</div>
            <div><span className="text-muted-foreground">User ID:</span> {user?.id}</div>
          </div>
        </div>

        {/* Referee Profile */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Referee Profile Lookup
            {loadingProfile ? (
              <span className="text-xs text-muted-foreground">(Loading...)</span>
            ) : refereeProfile ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
          </h3>
          {profileError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-3 text-sm text-destructive">
              Error: {String(profileError)}
            </div>
          )}
          {refereeProfile ? (
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-muted-foreground">Referee ID:</span> {refereeProfile.id}</div>
              <div><span className="text-muted-foreground">Name:</span> {refereeProfile.name}</div>
              <div><span className="text-muted-foreground">Email:</span> {refereeProfile.email}</div>
              <div><span className="text-muted-foreground">Country:</span> {refereeProfile.country}</div>
              <div><span className="text-muted-foreground">Grade:</span> {refereeProfile.grade}</div>
              <div><span className="text-muted-foreground">Status:</span> {refereeProfile.status}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No referee profile found for email: <span className="font-mono text-primary">{user?.email}</span>
            </div>
          )}
        </div>

        {/* Assignments */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Match Assignments
            {loadingAssignments ? (
              <span className="text-xs text-muted-foreground">(Loading...)</span>
            ) : (
              <span className="text-xs text-muted-foreground">({assignments.length} found)</span>
            )}
          </h3>
          {assignmentsError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-3 text-sm text-destructive">
              Error: {String(assignmentsError)}
            </div>
          )}
          {!refereeId ? (
            <div className="text-sm text-muted-foreground">Cannot query assignments without referee ID</div>
          ) : assignments.length === 0 ? (
            <div className="text-sm text-muted-foreground">No assignments found for referee ID: {refereeId}</div>
          ) : (
            <div className="space-y-2">
              {assignments.map((a: any) => (
                <div key={a.id} className="bg-muted rounded-lg p-3 text-sm">
                  <div className="font-semibold">{a.matches?.home_team} vs {a.matches?.away_team}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {a.assignment_status} • Assigned: {new Date(a.assigned_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Match Reports
            {loadingReports ? (
              <span className="text-xs text-muted-foreground">(Loading...)</span>
            ) : (
              <span className="text-xs text-muted-foreground">({reports.length} found)</span>
            )}
          </h3>
          {reportsError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-3 text-sm text-destructive">
              Error: {String(reportsError)}
            </div>
          )}
          {!refereeId ? (
            <div className="text-sm text-muted-foreground">Cannot query reports without referee ID</div>
          ) : reports.length === 0 ? (
            <div className="text-sm text-muted-foreground">No reports found for referee ID: {refereeId}</div>
          ) : (
            <div className="space-y-2">
              {reports.map((r: any) => (
                <div key={r.id} className="bg-muted rounded-lg p-3 text-sm">
                  <div className="font-semibold">{r.matches?.home_team} vs {r.matches?.away_team}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {r.report_status} • Created: {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-primary">Troubleshooting Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Verify your email matches a referee record in the database</li>
            <li>Check that assignments exist in referee_assignments table with your referee_id</li>
            <li>Ensure the matches table has the referenced match records</li>
            <li>Check browser console for any error messages</li>
            <li>Verify Supabase RLS policies allow reading these tables</li>
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}
