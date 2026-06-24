import type { User } from '../types';

export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch authenticated user', error);
    return null;
  }
};

export const authRequest = async <T = any>(endpoint: string, init: RequestInit = {}): Promise<T | null> => {
  try {
    const response = await fetch(`/api/auth${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string>),
      },
      ...init,
    });

    if (!response.ok) {
      console.warn(`Auth request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Auth request error', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  return authRequest<{ user: User; token?: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signUpUser = async (payload: {
  email: string;
  password: string;
  name: string;
  role: string;
  avatarUrl: string;
  startingWealth: number;
}) => {
  return authRequest<{ user: User; token?: string }>('/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
