import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Clock, CheckCircle } from 'lucide-react';

export default function RefereeDashboard() {
  const { t } = useTranslation();

  const upcomingMatches = [
    { id: 1, match: 'Vital\'O FC vs Le Messager', date: 'Jan 15, 2026', time: '15:00', venue: 'Intwari Stadium' },
    { id: 2, match: 'Aigle Noir vs Athletico', date: 'Jan 18, 2026', time: '16:00', venue: 'Prince Louis Stadium' },
  ];

  const recentReports = [
    { match: 'Flambeau vs Musongati', date: 'Jan 10, 2026', status: 'Submitted' },
    { match: 'Lydia vs Olympic', date: 'Jan 7, 2026', status: 'Approved' },
  ];

  return (
    <DashboardLayout allowedRoles={['referee']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">Referee Portal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Matches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Matches Officiated</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This season</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">All submitted</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="p-4 rounded-lg bg-muted">
                    <p className="font-semibold">{match.match}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{match.date}</span>
                      <span>{match.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{match.venue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Match Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{report.match}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
