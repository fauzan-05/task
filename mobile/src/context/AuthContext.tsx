import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Restore stored JWT and validate session on app startup
   */
  const restoreSession = useCallback(async () => {
    try {
      const storedToken = await StorageService.getAuthToken();

      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      // Verify token with backend
      try {
        const res = await authService.getMe();
        if (res && res.user) {
          setUser(res.user);
        } else {
          await StorageService.removeAuthToken();
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.log('[AuthContext] Session verification failed:', err);
        await StorageService.removeAuthToken();
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.log('[AuthContext] Storage read error:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /**
   * Login action
   */
  const login = async (data: LoginPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.login(data);
      if (res && res.token && res.user) {
        await StorageService.setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  /**
   * Register action
   */
  const register = async (data: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.register(data);
      if (res && res.token && res.user) {
        await StorageService.setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Registration failed. Please try again.',
      };
    }
  };

  /**
   * Logout action
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout().catch(() => {});
    } finally {
      await StorageService.removeAuthToken();
      setToken(null);
      setUser(null);
    }
  };

  /**
   * Re-fetch active user details
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (error) {
      console.warn('[AuthContext] Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
