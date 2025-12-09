/**
 * API Configuration
 * Centralized axios instance for all API calls
 */

import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get API URL from environment variable
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Determine the correct base URL based on environment and platform
const getApiBaseUrl = () => {
  // Production: Use environment variable (same for all platforms)
  if (ENV_API_URL && !ENV_API_URL.includes('localhost')) {
    return ENV_API_URL;
  }

  // Development: Platform-specific localhost URLs
  if (Platform.OS === 'android') {
    return "http://10.0.2.2:3000/api";
  } else {
    // iOS, Web, and other platforms
    return "http://localhost:3000/api";
  }
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in all requests
});

// Response interceptor to unwrap API response format
api.interceptors.response.use(
  (response) => response.data as any,
  (error) => {
    // Don't log 401 errors - these are expected when not authenticated
    if (error?.response?.status !== 401) {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Request interceptor for authorization header using AsyncStorage
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
