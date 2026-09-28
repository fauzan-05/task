import { api } from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authService = {
  /**
   * Register a new user account
   * POST /api/auth/register
   */
  async register(data: RegisterPayload): Promise<AuthResponseData> {
    return api.post<AuthResponseData>('/auth/register', data);
  },

  /**
   * Log into an existing account
   * POST /api/auth/login
   */
  async login(data: LoginPayload): Promise<AuthResponseData> {
    return api.post<AuthResponseData>('/auth/login', data);
  },

  /**
   * Log out active session
   * POST /api/auth/logout
   */
  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/logout');
  },

  /**
   * Retrieve active user profile
   * GET /api/auth/me
   */
  async getMe(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me');
  },
};
