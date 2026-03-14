import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BRICS_TIMEZONES, useTimezone } from '@/context/TimezoneContext';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useApi';
import LanguageSelector from '@/components/LanguageSelector';
import {
  LayoutDashboard, Shield, Trophy, Users, FileText, Activity,
  Star, Briefcase, LogOut, Globe, Settings, Bell, ChevronDown,
  Menu, X, Building2, Map, AlertTriangle, UserCheck, UserCog, ScrollText,
  Calendar, Edit3, Gavel, ArrowRightLeft, Users as UsersIcon, Upload, Building
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  permission?: string;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Building2, label: 'My Team', href: '/dashboard/team-manager', permission: 'team_manager_only' },
  { icon: UsersIcon, label: 'Squad', href: '/dashboard/squad-management-team', permission: 'team_manager_only' },
  { icon: ArrowRightLeft, label: 'Transfers', href: '/dashboard/player-transfer-team', permission: 'team_manager_only' },
  { icon: Shield, label: 'Governance', href: '/dashboard/governance', permission: 'view_governance' },
  { icon: Upload, label: 'Upload Document', href: '/dashboard/document-upload', permission: 'view_governance' },
  { icon: Trophy, label: 'Competitions', href: '/dashboard/competitions', permission: 'view_competitions' },
  { icon: Users, label: 'Competition Entries', href: '/dashboard/competition-entries', permission: 'federation_admin_only' },
  { icon: Calendar, label: 'Schedule Matches', href: '/dashboard/match-scheduling', permission: 'view_secretariat' },
  { icon: Edit3, label: 'Match Results', href: '/dashboard/match-results', permission: 'view_secretariat' },
  { icon: Star, label: 'Referee Registry', href: '/dashboard/referees', permission: 'manage_referees' },
  { icon: UserCheck, label: 'My Assignments', href: '/dashboard/referee-dashboard' },
  { icon: FileText, label: 'Match Reports', href: '/dashboard/match-reports', permission: 'view_referees' },
  { icon: AlertTriangle, label: 'Suspensions', href: '/dashboard/referee-suspensions', permission: 'view_referees' },
  { icon: FileText, label: 'Disciplinary', href: '/dashboard/disciplinary', permission: 'view_disciplinary', badge: '3', badgeColor: 'destructive' },
  { icon: Gavel, label: 'Issue Sanctions', href: '/dashboard/issue-sanction', permission: 'super_admin_only' },
  { icon: Users, label: 'Athletes', href: '/dashboard/players', permission: 'view_players' },
  { icon: Building2, label: 'Teams', href: '/dashboard/teams', permission: 'view_teams' },
  { icon: Activity, label: 'Statistics', href: '/dashboard/stats', permission: 'view_stats' },
  { icon: Briefcase, label: 'Match Assignment', href: '/dashboard/secretariat', permission: 'view_secretariat' },
  { icon: Building, label: 'Federations', href: '/dashboard/federation-management', permission: 'super_admin_only' },
  { icon: UserCog, label: 'User Management', href: '/dashboard/user-management', permission: 'super_admin_only' },
  { icon: ScrollText, label: 'Audit Logs', href: '/dashboard/audit-logs', permission: 'super_admin_only' },
  { icon: Settings, label: 'Change Password', href: '/dashboard/change-password' },
];

const roleColors: Record<string, string> = {
  super_admin: 'text-primary',
  federation_admin: 'text-bifa-blue',
  secretariat_officer: 'text-secondary',
  referee: 'text-muted-foreground',
  team_manager: 'text-secondary',
  public_user: 'text-muted-foreground',
};

const roleBadgeColors: Record<string, string> = {
  super_admin: 'bg-primary/20 text-primary',
  federation_admin: 'bg-bifa-blue/20 text-bifa-blue',
  secretariat_officer: 'bg-secondary/20 text-secondary-foreground',
  referee: 'bg-muted text-muted-foreground',
  team_manager: 'bg-secondary/20 text-secondary-foreground',
  public_user: 'bg-muted text-muted-foreground',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { userTimezone, setUserTimezone } = useTimezone();
  const { data: notifications = [] } = useNotifications(user?.email);
  const markAsRead = useMarkNotificationAsRead();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const visibleNavItems = navItems.filter(item => {
    // Show "My Team" only to team managers
    if (item.permission === 'team_manager_only') {
      return user?.role === 'team_manager';
    }
    // Show "My Assignments" only to referees
    if (item.href === '/dashboard/referee-dashboard') {
      return user?.role === 'referee';
    }
    // Show super admin only items
    if (item.permission === 'super_admin_only') {
      return user?.role === 'super_admin';
    }
    // Show federation admin only items
    if (item.permission === 'federation_admin_only') {
      return user?.role === 'federation_admin' || user?.role === 'super_admin';
    }
    if (!item.permission) return true;
    return hasPermission(item.permission as any);
  });

  const roleLabel = user?.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 gradient-sidebar border-r border-border flex flex-col transition-all duration-300 z-40 overflow-hidden`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border gap-3">
          <div className="w-8 h-8 gradient-green rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
            <span className="text-primary-foreground font-display text-sm">B</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-display text-lg text-primary leading-none">BIFA</div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Management System</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <div className="space-y-0.5 px-2">
            {visibleNavItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all group ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive(item.href) ? 'text-primary' : ''}`} />
                {sidebarOpen && (
                  <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{t(item.label.toLowerCase().replace(/ /g, ''))}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold bg-${item.badgeColor} text-${item.badgeColor}-foreground`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t border-border p-3">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 transition-colors"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
              {user?.avatar || 'U'}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{user?.name}</div>
                  <div className={`text-xs truncate ${roleColors[user?.role || '']}`}>{roleLabel}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </>
            )}
          </div>
          {showProfile && sidebarOpen && (
            <div className="mt-2 bg-muted rounded-lg p-2 space-y-1 text-xs">
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Timezone:</span> {user?.timezone}
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Country:</span> {user?.country}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {user?.mfaEnabled && (
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">MFA ✓</span>
                )}
                <span className={`px-1.5 py-0.5 rounded text-xs ${roleBadgeColors[user?.role || '']}`}>{roleLabel}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-destructive hover:bg-destructive/10 px-2 py-1.5 rounded transition-colors mt-1"
              >
                <LogOut className="w-3 h-3" />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex-1 text-sm text-muted-foreground">
            {navItems.find(n => isActive(n.href))?.label || 'BIFA'}
          </div>

          <div className="flex items-center gap-2">
            {/* Timezone selector */}
            <div className="relative">
              <button
                onClick={() => setShowTimezone(!showTimezone)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden sm:block">{userTimezone.split('/')[1]?.replace('_', ' ')}</span>
              </button>
              {showTimezone && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-card border border-border rounded-xl shadow-card z-50 p-2">
                  <p className="text-xs text-muted-foreground px-2 py-1 mb-1">Display timezone</p>
                  {BRICS_TIMEZONES.map(tz => (
                    <button
                      key={tz.timezone}
                      onClick={() => { setUserTimezone(tz.timezone); setShowTimezone(false); }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors ${
                        userTimezone === tz.timezone ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      <span>{tz.flag}</span>
                      <span>{tz.country}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{tz.utcOffset}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <LanguageSelector />

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-xl shadow-card z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.slice(0, 10).map(notif => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            if (!notif.read) markAsRead.mutate(notif.id);
                            if (notif.link) navigate(notif.link);
                            setShowNotifications(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-muted transition-colors ${
                            !notif.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Bell className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{notif.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{notif.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(notif.created_at).toLocaleString()}
                              </div>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 animate-fade-in">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
