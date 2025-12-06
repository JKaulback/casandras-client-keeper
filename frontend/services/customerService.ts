/**
 * Customer API Service
 * All customer-related API calls
 */

import axios from 'axios';
import API_BASE_URL from './api';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  occupation?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle API response format
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const customerService = {
  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    const result: ApiResponse<Customer[]> = await api.get('/customers');
    return result.data;
  },

  /**
   * Get a single customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const result: ApiResponse<Customer> = await api.get(`/customers/${id}`);
    return result.data;
  },

  /**
   * Create a new customer
   */
  async create(customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const result: ApiResponse<Customer> = await api.post('/customers', customerData);
    return result.data;
  },

  /**
   * Update an existing customer
   */
  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    const result: ApiResponse<Customer> = await api.put(`/customers/${id}`, customerData);
    return result.data;
  },

  /**
   * Delete a customer
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};

export type { Customer };
