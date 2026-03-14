import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMatchReports } from '@/hooks/useApi';
import { useTimezone } from '@/context/TimezoneContext';
import { FileText, Search, Filter, Eye } from 'lucide-react';

export default function MatchReports() {
  const { formatMatchTime } = useTimezone();
  const { data: reports = [], isLoading } = useMatchReports();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const filtered = reports.filter((r: any) =>
    (filterStatus === 'all' || r.report_status === filterStatus) &&
    (r.matches?.home_team?.toLowerCase().includes(search.toLowerCase()) ||
     r.matches?.away_team?.toLowerCase().includes(search.toLowerCase()) ||
     r.referees?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="font-display text-3xl">Match Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">View all referee match reports</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Reports</div>
            <div className="text-2xl font-bold">{reports.length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted</div>
            <div className="text-2xl font-bold">{reports.filter((r: any) => r.report_status === 'submitted').length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reviewed</div>
            <div className="text-2xl font-bold">{reports.filter((r: any) => r.report_status === 'reviewed').length}</div>
          </div>
          <div className="stat-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Draft</div>
            <div className="text-2xl font-bold">{reports.filter((r: any) => r.report_status === 'draft').length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by match or referee..."
              className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {['all', 'submitted', 'reviewed', 'draft'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                filterStatus === status ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No match reports found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((report: any) => (
              <div key={report.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">
                      {report.matches?.home_team} vs {report.matches?.away_team}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.matches?.competition} • {formatMatchTime(report.matches?.kickoff_utc).time}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Referee: {report.referees?.name} ({report.referees?.country})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.report_status === 'reviewed' 
                        ? 'bg-primary/20 text-primary' 
                        : report.report_status === 'submitted'
                        ? 'bg-secondary/20 text-secondary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {report.report_status}
                    </span>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="text-xs text-muted-foreground">Yellow Cards</div>
                    <div className="font-bold">{report.yellow_cards}</div>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="text-xs text-muted-foreground">Red Cards</div>
                    <div className="font-bold">{report.red_cards}</div>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="text-xs text-muted-foreground">Penalties</div>
                    <div className="font-bold">{report.penalties}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-border sticky top-0 bg-card">
                <h3 className="font-semibold text-lg">Match Report Details</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="font-semibold text-xl mb-2">
                    {selectedReport.matches?.home_team} vs {selectedReport.matches?.away_team}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedReport.matches?.competition} • {formatMatchTime(selectedReport.matches?.kickoff_utc).time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Referee: {selectedReport.referees?.name} ({selectedReport.referees?.country})
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Yellow Cards</div>
                    <div className="text-2xl font-bold">{selectedReport.yellow_cards}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Red Cards</div>
                    <div className="text-2xl font-bold">{selectedReport.red_cards}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Penalties</div>
                    <div className="text-2xl font-bold">{selectedReport.penalties}</div>
                  </div>
                </div>

                {selectedReport.match_summary && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Match Summary</label>
                    <div className="bg-muted rounded-lg p-3 text-sm">{selectedReport.match_summary}</div>
                  </div>
                )}

                {selectedReport.incidents && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Incidents</label>
                    <div className="bg-muted rounded-lg p-3 text-sm">{selectedReport.incidents}</div>
                  </div>
                )}

                {selectedReport.injuries && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Injuries</label>
                    <div className="bg-muted rounded-lg p-3 text-sm">{selectedReport.injuries}</div>
                  </div>
                )}

                {selectedReport.additional_notes && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Additional Notes</label>
                    <div className="bg-muted rounded-lg p-3 text-sm">{selectedReport.additional_notes}</div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  Submitted: {selectedReport.submitted_at ? new Date(selectedReport.submitted_at).toLocaleString() : 'Not submitted'}
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full bg-muted text-foreground py-2.5 rounded-lg font-semibold hover:bg-accent"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
