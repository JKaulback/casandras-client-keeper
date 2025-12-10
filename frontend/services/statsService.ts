/**
 * Stats API Service
 * Dashboard statistics and analytics
 */

import api from './api';

interface DashboardStats {
  totalCustomers: number;
  totalDogs: number;
  todayAppointments: number;
  upcomingAppointments: number;
}

interface AppointmentStats {
  totalAppointments: number;
  thisWeekAppointments: number;
  pastAppointments: number;
  upcomingAppointments: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const statsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const result: ApiResponse<DashboardStats> = await api.get('/stats/dashboard');
    return result.data;
  },

  /**
   * Get appointment statistics
   */
  async getAppointmentStats(): Promise<AppointmentStats> {
    const result: ApiResponse<AppointmentStats> = await api.get('/stats/appointments');
    return result.data;
  },
};

export type { DashboardStats, AppointmentStats };
