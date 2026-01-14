import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserRole } from '@/types/auth';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-64 min-h-[calc(100vh-4rem)] p-6">
        {children}
      </main>
    </div>
  );
}
