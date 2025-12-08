/**
 * User API Service
 * User authentication and profile management
 */

import api from './api';

interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  oauthProvider: 'google' | 'facebook' | 'apple';
  oauthId: string;
  avatarUrl?: string;
  role: 'admin' | 'customer';
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userService = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const result: ApiResponse<User> = await api.get('/users/me');
    return result.data;
  },

  /**
   * Update current user profile
   */
  async updateProfile(userData: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl'>>): Promise<User> {
    const result: ApiResponse<User> = await api.put('/users/me', userData);
    return result.data;
  },
};

export type { User };
