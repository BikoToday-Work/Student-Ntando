import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Calendar, TrendingUp } from 'lucide-react';

export default function TeamManagerDashboard() {
  const { t } = useTranslation();

  const squadStats = {
    totalPlayers: 25,
    injured: 2,
    suspended: 1,
    available: 22,
  };

  return (
    <DashboardLayout allowedRoles={['teamManager']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">Team Manager Portal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Squad Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{squadStats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">{squadStats.available} available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">League Position</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3rd</div>
              <p className="text-xs text-muted-foreground">28 points</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Match</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 15</div>
              <p className="text-xs text-muted-foreground">vs Le Messager</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Form</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                <span className="w-6 h-6 rounded bg-green-500 text-white text-xs flex items-center justify-center">W</span>
                <span className="w-6 h-6 rounded bg-green-500 text-white text-xs flex items-center justify-center">W</span>
                <span className="w-6 h-6 rounded bg-gray-400 text-white text-xs flex items-center justify-center">D</span>
                <span className="w-6 h-6 rounded bg-green-500 text-white text-xs flex items-center justify-center">W</span>
                <span className="w-6 h-6 rounded bg-red-500 text-white text-xs flex items-center justify-center">L</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 5 matches</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Squad Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available</span>
                  <span className="font-semibold text-green-600">{squadStats.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Injured</span>
                  <span className="font-semibold text-amber-600">{squadStats.injured}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Suspended</span>
                  <span className="font-semibold text-red-600">{squadStats.suspended}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Fixtures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">vs Le Messager</p>
                  <p className="text-sm text-muted-foreground">Jan 15, 2026 • Home</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">vs Aigle Noir</p>
                  <p className="text-sm text-muted-foreground">Jan 22, 2026 • Away</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
