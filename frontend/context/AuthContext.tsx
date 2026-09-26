'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authService, LoginPayload, RegisterPayload } from '@/services/auth.service';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<User | null>;
  register: (data: RegisterPayload) => Promise<User | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { error: showError, success: showSuccess } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data: LoginPayload): Promise<User | null> => {
    try {
      setIsLoading(true);
      const res = await authService.login(data);
      if (typeof window !== 'undefined' && res.token) {
        localStorage.setItem('auth_token', res.token);
      }
      setUser(res.user);
      showSuccess(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err: any) {
      showError(err.message || 'Login failed. Please check your credentials.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload): Promise<User | null> => {
    try {
      setIsLoading(true);
      const res = await authService.register(data);
      if (typeof window !== 'undefined' && res.token) {
        localStorage.setItem('auth_token', res.token);
      }
      setUser(res.user);
      showSuccess(`Account created successfully! Welcome, ${res.user.name}!`);
      return res.user;
    } catch (err: any) {
      showError(err.message || 'Registration failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      showSuccess('Logged out successfully.');
    } catch (err: any) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      showError(err.message || 'Failed to logout.');
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
