import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';

WebBrowser.maybeCompleteAuthSession();

// Get API URL with platform-specific handling
const getApiUrl = () => {
  const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  // For Android emulator, use 10.0.2.2 instead of localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();
const REDIRECT_URI = Constants.expoConfig?.extra?.redirectUri || process.env.EXPO_PUBLIC_REDIRECT_URI;

interface VerifyTokenResponse {
  valid: boolean;
  user?: any;
  error?: string;
}

class AuthService {
  private tokenKey = 'userToken';

  async signInWithGoogle() {
    try {
      // Use environment variable or fallback to makeRedirectUri
      const redirectUri = REDIRECT_URI || AuthSession.makeRedirectUri({
        path: 'auth/callback'
      });

      console.log('Using redirect URI:', redirectUri);
      console.log('Using API URL:', API_URL);

      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/api/auth/google`,
        redirectUri
      );

      console.log('Auth session result:', result);

      // For web with cookies, the popup closes automatically
      // We need to verify authentication regardless of the result type
      // because the cookie is set in the main window even when popup closes
      if (result.type === 'success' || result.type === 'cancel' || result.type === 'dismiss') {
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const verifyResult = await this.verifyToken();
        
        if (verifyResult.valid) {
          return { success: true, user: verifyResult.user };
        }
      }

      return { success: false, error: 'Authentication cancelled or failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: String(error) };
    }
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    try {
      // axios interceptor unwraps response.data, so this is already VerifyTokenResponse
      const data: any = await api.post('/auth/verify');
      return data as VerifyTokenResponse;
    } catch (error: any) {
      // Don't log 401 errors (unauthenticated) - this is expected when not logged in
      if (error?.response?.status !== 401) {
        console.error('Token verification error:', error);
      }
      return { valid: false, error: String(error) };
    }
  }

  async signOut() {
    await AsyncStorage.removeItem(this.tokenKey);
    // Call backend to clear cookie
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser() {
    const result = await this.verifyToken();
    return result?.valid ? result.user : null;
  }
}

export default new AuthService();