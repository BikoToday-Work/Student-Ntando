export type UserRole = 
  | 'admin' 
  | 'secretariat' 
  | 'referee' 
  | 'teamManager' 
  | 'federationOfficial';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// Role-based route access configuration
export const roleRoutes: Record<UserRole, string> = {
  admin: '/admin',
  secretariat: '/secretariat',
  referee: '/referee',
  teamManager: '/team-manager',
  federationOfficial: '/federation',
};

export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  secretariat: ['matches', 'teams', 'registrations', 'documents'],
  referee: ['matches', 'reports', 'schedule'],
  teamManager: ['team', 'players', 'schedule'],
  federationOfficial: ['reports', 'statistics', 'oversight'],
};
