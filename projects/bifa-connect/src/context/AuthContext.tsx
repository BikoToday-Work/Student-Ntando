import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'super_admin' | 'federation_admin' | 'secretariat_officer' | 'referee' | 'team_manager' | 'public_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  timezone: string;
  avatar?: string;
  mfaEnabled: boolean;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean, error: string | null }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

export type Permission =
  | 'view_governance'
  | 'edit_governance'
  | 'approve_documents'
  | 'view_secretariat'
  | 'manage_tasks'
  | 'view_referees'
  | 'manage_referees'
  | 'view_disciplinary'
  | 'manage_disciplinary'
  | 'view_competitions'
  | 'manage_competitions'
  | 'view_players'
  | 'manage_players'
  | 'view_teams'
  | 'manage_teams'
  | 'view_stats'
  | 'view_audit_logs'
  | 'manage_users'
  | 'system_admin';

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_governance', 'edit_governance', 'approve_documents',
    'view_secretariat', 'manage_tasks',
    'view_referees', 'manage_referees',
    'view_disciplinary', 'manage_disciplinary',
    'view_competitions', 'manage_competitions',
    'view_players', 'manage_players',
    'view_teams', 'manage_teams',
    'view_stats', 'view_audit_logs', 'manage_users', 'system_admin'
  ],
  federation_admin: [
    'view_governance', 'edit_governance', 'approve_documents',
    'view_secretariat', 'manage_tasks',
    'view_referees', 'manage_referees',
    'view_disciplinary', 'manage_disciplinary',
    'view_competitions', 'manage_competitions',
    'view_players', 'manage_players',
    'view_teams', 'manage_teams',
    'view_stats', 'view_audit_logs', 'manage_users'
  ],
  secretariat_officer: [
    'view_governance', 'edit_governance', 'approve_documents',
    'view_secretariat', 'manage_tasks',
    'view_referees', 'view_disciplinary', 'view_competitions',
    'view_players', 'view_teams', 'view_stats'
  ],
  referee: [
    'view_competitions', 'view_players', 'view_teams', 'view_stats', 'view_referees'
  ],
  team_manager: [
    'view_competitions', 'view_players', 'manage_players', 'view_teams', 'manage_teams', 'view_stats'
  ],
  public_user: ['view_stats', 'view_competitions'],
};



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserProfile(session.user.id);
      else { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUserId: string) => {
    const { data } = await supabase.from('users').select('*').eq('auth_user_id', authUserId).single();
    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        country: data.country || '',
        timezone: data.timezone || 'UTC',
        avatar: data.avatar,
        mfaEnabled: data.mfa_enabled,
        lastLogin: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean, error: string | null }> => {
    // Mock authentication for demo/testing
    const mockUsers: Record<string, { name: string; role: UserRole; country: string; timezone: string }> = {
      'admin@bifa.org': { name: 'Super Admin', role: 'super_admin', country: 'International', timezone: 'UTC' },
      'federation@bifa.org': { name: 'Federation Admin', role: 'federation_admin', country: 'Brazil', timezone: 'America/Sao_Paulo' },
      'tite@flamengo.br': { name: 'Tite Silva', role: 'team_manager', country: 'Brazil', timezone: 'America/Sao_Paulo' },
      'abel@palmeiras.br': { name: 'Abel Ferreira', role: 'team_manager', country: 'Brazil', timezone: 'America/Sao_Paulo' },
      'semak@zenit.ru': { name: 'Sergei Semak', role: 'team_manager', country: 'Russia', timezone: 'Europe/Moscow' },
      'des@mumbaicity.in': { name: 'Des Buckingham', role: 'team_manager', country: 'India', timezone: 'Asia/Kolkata' },
      'wu@shanghaiport.cn': { name: 'Wu Jingui', role: 'team_manager', country: 'China', timezone: 'Asia/Shanghai' },
      'rulani@sundowns.co.za': { name: 'Rulani Mokwena', role: 'team_manager', country: 'South Africa', timezone: 'Africa/Johannesburg' },
    };

    // Check if referee exists in database
    const { data: refereeData } = await supabase
      .from('referees')
      .select('*')
      .eq('email', email)
      .single();

    if (refereeData) {
      setUser({
        id: refereeData.id,
        name: refereeData.name,
        email: refereeData.email,
        role: 'referee',
        country: refereeData.country,
        timezone: 'UTC',
        avatar: refereeData.name.split(' ').map(n => n[0]).join(''),
        mfaEnabled: false,
        lastLogin: new Date().toISOString(),
      });
      return { success: true, error: null };
    }

    // Check mock users
    if (mockUsers[email]) {
      const mockUser = mockUsers[email];
      setUser({
        id: email,
        name: mockUser.name,
        email: email,
        role: mockUser.role,
        country: mockUser.country,
        timezone: mockUser.timezone,
        avatar: mockUser.name.split(' ').map(n => n[0]).join(''),
        mfaEnabled: false,
        lastLogin: new Date().toISOString(),
      });
      return { success: true, error: null };
    }

    // Try Supabase auth if not a mock user
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Supabase Login Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) ?? false;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
