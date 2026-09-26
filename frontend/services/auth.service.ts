import { api } from '@/lib/api';
import { User } from '@/types';

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
  async register(data: RegisterPayload): Promise<AuthResponseData> {
    return api.post<AuthResponseData>('/auth/register', data);
  },

  async login(data: LoginPayload): Promise<AuthResponseData> {
    return api.post<AuthResponseData>('/auth/login', data);
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/logout');
  },

  async getMe(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me');
  },
};
