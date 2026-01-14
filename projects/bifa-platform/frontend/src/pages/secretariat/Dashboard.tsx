import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Calendar, Users } from 'lucide-react';

export default function SecretariatDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout allowedRoles={['secretariat']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">Secretariat Portal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Registrations</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Documents to Process</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Fixtures</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">To schedule</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">League registered</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors">
                <ClipboardList className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Process Registration</h3>
                <p className="text-sm text-muted-foreground">Review player/team applications</p>
              </div>
              <div className="p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors">
                <Calendar className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Schedule Match</h3>
                <p className="text-sm text-muted-foreground">Create new fixture</p>
              </div>
              <div className="p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Generate Report</h3>
                <p className="text-sm text-muted-foreground">Export data and statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
