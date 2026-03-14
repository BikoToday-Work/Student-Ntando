export type UserRole = 
  | 'ADMIN' 
  | 'SECRETARIAT' 
  | 'REFEREE' 
  | 'TEAM_MANAGER' 
  | 'FEDERATION_OFFICIAL';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export const roleRoutes: Record<UserRole, string> = {
  ADMIN: '/admin',
  SECRETARIAT: '/secretariat',
  REFEREE: '/referee',
  TEAM_MANAGER: '/team-manager',
  FEDERATION_OFFICIAL: '/federation',
};
