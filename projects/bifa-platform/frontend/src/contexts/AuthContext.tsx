import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, UserRole, roleRoutes } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getRoleDashboard: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for prototype (NOT FOR PRODUCTION)
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@bifa.bi': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@bifa.bi',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  },
  'secretariat@bifa.bi': {
    password: 'secret123',
    user: {
      id: '2',
      email: 'secretariat@bifa.bi',
      name: 'Secretariat Staff',
      role: 'secretariat',
      createdAt: new Date().toISOString(),
    },
  },
  'referee@bifa.bi': {
    password: 'referee123',
    user: {
      id: '3',
      email: 'referee@bifa.bi',
      name: 'Match Referee',
      role: 'referee',
      createdAt: new Date().toISOString(),
    },
  },
  'manager@bifa.bi': {
    password: 'manager123',
    user: {
      id: '4',
      email: 'manager@bifa.bi',
      name: 'Team Manager',
      role: 'teamManager',
      createdAt: new Date().toISOString(),
    },
  },
  'official@bifa.bi': {
    password: 'official123',
    user: {
      id: '5',
      email: 'official@bifa.bi',
      name: 'Federation Official',
      role: 'federationOfficial',
      createdAt: new Date().toISOString(),
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('bifa-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('bifa-user');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const demoUser = DEMO_USERS[credentials.email.toLowerCase()];
    
    if (!demoUser || demoUser.password !== credentials.password) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = demoUser.user;
    localStorage.setItem('bifa-user', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    if (DEMO_USERS[data.email.toLowerCase()]) {
      return { success: false, error: 'Email already registered' };
    }

    // In a real app, this would create a user in the database
    // For demo, we just log them in with a default role
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'teamManager', // Default role for new registrations
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('bifa-user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('bifa-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const getRoleDashboard = (): string => {
    if (!authState.user) return '/';
    return roleRoutes[authState.user.role] || '/';
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        getRoleDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
