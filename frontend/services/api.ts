/**
 * API Configuration
 * Centralized API endpoint and configuration
 */

import { Platform } from 'react-native';

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

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
