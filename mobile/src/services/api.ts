import { getApiBaseUrl } from '../config/env';
import { StorageService } from './storage';
import { ApiResponse } from '../types';

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  const baseUrl = getApiBaseUrl();

  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = await StorageService.getAuthToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    let data: ApiResponse<T>;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        success: response.ok,
        message: text,
      };
    }

    if (!response.ok || data.success === false) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data.errors
      );
    }

    return (data.data !== undefined ? data.data : data) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new ApiError('Connection timed out. Please check backend server and network.', 408);
    }
    throw new ApiError(
      error.message || 'Unable to connect to backend server. Please verify backend is running.',
      0
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
