/**
 * Customer API Service
 * All customer-related API calls
 */

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

export const customerService = {
  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<Customer[]> = await response.json();
    return result.data;
  },

  /**
   * Get a single customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<Customer> = await response.json();
    return result.data;
  },

  /**
   * Create a new customer
   */
  async create(customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<Customer> = await response.json();
    return result.data;
  },

  /**
   * Update an existing customer
   */
  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<Customer> = await response.json();
    return result.data;
  },

  /**
   * Delete a customer
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};

export type { Customer };
