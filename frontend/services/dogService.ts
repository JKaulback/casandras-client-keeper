/**
 * Dog API Service
 * All dog-related API calls
 */

import api from './api';

interface Dog {
  _id: string;
  ownerId: string;
  name: string;
  sex: 'male' | 'female' | 'unknown';
  breed?: string;
  dob?: string;
  color?: string;
  weight?: number;
  vet?: string;
  medicalInfo?: string;
  rabiesVaccineDate?: string;
  areVaccinesCurrent?: boolean;
  isFixed?: boolean;
  temperament?: string;
  imageURL?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export const dogService = {
  /**
   * Get all dogs
   */
  async getAll(): Promise<Dog[]> {
    const result: ApiResponse<Dog[]> = await api.get('/dogs');
    return result.data;
  },

  /**
   * Get a single dog by ID
   */
  async getById(id: string): Promise<Dog> {
    const result: ApiResponse<Dog> = await api.get(`/dogs/${id}`);
    return result.data;
  },

  /**
   * Get all dogs for a specific owner
   */
  async getByOwnerId(ownerId: string): Promise<Dog[]> {
    const result: ApiResponse<Dog[]> = await api.get(`/dogs/owner/${ownerId}`);
    return result.data;
  },

  /**
   * Create a new dog
   */
  async create(dogData: Omit<Dog, '_id' | 'createdAt' | 'updatedAt'>): Promise<Dog> {
    const result: ApiResponse<Dog> = await api.post('/dogs', dogData);
    return result.data;
  },

  /**
   * Update an existing dog
   */
  async update(id: string, dogData: Partial<Dog>): Promise<Dog> {
    const result: ApiResponse<Dog> = await api.put(`/dogs/${id}`, dogData);
    return result.data;
  },

  /**
   * Delete a dog
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/dogs/${id}`);
  },
};

export type { Dog };
