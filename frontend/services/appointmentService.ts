/**
 * Appointment API Service
 * All appointment-related API calls
 */

import api from './api';

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  byDay?: string[];
  endDate?: string;
}

interface Appointment {
  _id: string;
  customerId: string;
  dogId: string;
  dateTime: string;
  durationMinutes: number;
  cost: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  conflictFlag: boolean;
  conflictNote?: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'partial';
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export const appointmentService = {
  /**
   * Get all appointments
   */
  async getAll(): Promise<Appointment[]> {
    const result: ApiResponse<Appointment[]> = await api.get('/appointments');
    return result.data;
  },

  /**
   * Get a single appointment by ID
   */
  async getById(id: string): Promise<Appointment> {
    const result: ApiResponse<Appointment> = await api.get(`/appointments/${id}`);
    return result.data;
  },

  /**
   * Get all appointments for a specific customer
   */
  async getByCustomerId(customerId: string): Promise<Appointment[]> {
    const result: ApiResponse<Appointment[]> = await api.get(`/appointments/customer/${customerId}`);
    return result.data;
  },

  /**
   * Get all appointments for a specific dog
   */
  async getByDogId(dogId: string): Promise<Appointment[]> {
    const result: ApiResponse<Appointment[]> = await api.get(`/appointments/dog/${dogId}`);
    return result.data;
  },

  /**
   * Create a new appointment
   */
  async create(appointmentData: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const result: ApiResponse<Appointment> = await api.post('/appointments', appointmentData);
    return result.data;
  },

  /**
   * Update an existing appointment
   */
  async update(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const result: ApiResponse<Appointment> = await api.put(`/appointments/${id}`, appointmentData);
    return result.data;
  },

  /**
   * Delete an appointment
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },
};

export type { Appointment, RecurrenceRule };
