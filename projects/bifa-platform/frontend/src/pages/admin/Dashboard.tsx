import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Shield, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const stats = [
    { label: 'Total Teams', value: '16', icon: Shield, trend: '+2 this season' },
    { label: 'Active Players', value: '240', icon: Users, trend: '+15 this month' },
    { label: 'Scheduled Matches', value: '24', icon: Calendar, trend: 'Next 30 days' },
    { label: 'Pending Documents', value: '8', icon: FileText, trend: 'Requires review' },
  ];

  const recentActivities = [
    { action: 'New team registered', detail: 'FC Bujumbura United', time: '2 hours ago' },
    { action: 'Match result submitted', detail: 'Vital\'O FC 2-1 Aigle Noir', time: '5 hours ago' },
    { action: 'Player transfer approved', detail: 'Jean-Pierre Nkurunziza', time: '1 day ago' },
    { action: 'Referee assigned', detail: 'Match #45 - League Week 12', time: '1 day ago' },
  ];

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">Administrator Control Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-md bg-amber-50 border border-amber-200">
                  <span className="text-sm">3 player registrations awaiting approval</span>
                  <span className="text-xs text-amber-600 font-medium">Review</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-amber-50 border border-amber-200">
                  <span className="text-sm">5 match reports need verification</span>
                  <span className="text-xs text-amber-600 font-medium">Review</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-red-50 border border-red-200">
                  <span className="text-sm">2 disciplinary cases pending</span>
                  <span className="text-xs text-red-600 font-medium">Urgent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
