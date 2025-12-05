import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Team } from '../types';
import { adminService, teamService } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  currentTeam: Team | null;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => Promise<void>;
  registerAdmin: (username: string, email: string, password: string) => Promise<void>;
  loginTeam: (username: string, password: string) => Promise<void>;
  registerTeam: (teamData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    const storedTeam = localStorage.getItem('currentTeam');

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }

    if (storedTeam) {
      try {
        setCurrentTeam(JSON.parse(storedTeam));
      } catch (e) {
        localStorage.removeItem('currentTeam');
      }
    }

    setLoading(false);
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    try {
      const response = await adminService.login({ username, password });
      const user = response.data;
      setCurrentUser(user);
      setCurrentTeam(null);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.removeItem('currentTeam');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const registerAdmin = async (username: string, email: string, password: string) => {
    try {
      const response = await adminService.register({ username, email, password });
      // Don't auto-login after registration - just return success
      // User will need to login manually
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const loginTeam = async (username: string, password: string) => {
    try {
      const response = await teamService.login({ username, password });
      const team = response.data;
      setCurrentTeam(team);
      setCurrentUser(null);
      localStorage.setItem('currentTeam', JSON.stringify(team));
      localStorage.removeItem('currentUser');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const registerTeam = async (teamData: any) => {
    try {
      const response = await teamService.register(teamData);
      const team = response.data;
      setCurrentTeam(team);
      setCurrentUser(null);
      localStorage.setItem('currentTeam', JSON.stringify(team));
      localStorage.removeItem('currentUser');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentTeam(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentTeam');
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTeam,
        isAdmin,
        loginAdmin,
        registerAdmin,
        loginTeam,
        registerTeam,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

