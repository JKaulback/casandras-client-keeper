import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';

WebBrowser.maybeCompleteAuthSession();

// Get base API URL (without /api suffix)
const getBaseApiUrl = () => {
  const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  return 'http://localhost:3000';
};

const API_BASE_URL = getBaseApiUrl();

interface VerifyTokenResponse {
  valid: boolean;
  user?: any;
  error?: string;
}

class AuthService {
  private tokenKey = 'userToken';

  async signInWithGoogle() {
    try {
      // Web: Use popup window with postMessage
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          const handleMessage = async (event: MessageEvent) => {
            if (event.data.type === 'auth_success' && event.data.token) {
              window.removeEventListener('message', handleMessage);
              
              await AsyncStorage.setItem(this.tokenKey, event.data.token);
              
              const verifyResult = await this.verifyToken();
              if (verifyResult.valid) {
                resolve({ success: true, user: verifyResult.user });
              } else {
                resolve({ success: false, error: 'Token verification failed' });
              }
            }
          };
          
          window.addEventListener('message', handleMessage);
          
          const authUrl = `${API_BASE_URL}/api/auth/google`;
          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;
          
          window.open(
            authUrl,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          
          setTimeout(() => {
            window.removeEventListener('message', handleMessage);
            resolve({ success: false, error: 'Authentication timeout' });
          }, 5 * 60 * 1000);
        });
      }

      // Mobile: Use Chrome Custom Tabs with development workaround
      const redirectUri = 'exp://localhost:8081';
      const authUrl = `${API_BASE_URL}/api/auth/google?mobile=true&redirectUri=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      // Production: Token returned via deep link redirect
      if (result.type === 'success' && result.url) {
        const match = result.url.match(/[?&]token=([^&]+)/);
        if (match) {
          const token = match[1];
          await AsyncStorage.setItem(this.tokenKey, token);
          
          const verifyResult = await this.verifyToken();
          if (verifyResult.valid) {
            return { success: true, user: verifyResult.user };
          }
        }
      }
      
      // Browser dismissed after authentication
      if (result.type === 'dismiss' || result.type === 'cancel') {
        // Development: Retrieve token from temporary backend storage
        if (__DEV__ && (Platform.OS as string) !== 'web') {
          await new Promise(resolve => setTimeout(resolve, 1500));
          try {
            const response = await fetch(`${API_BASE_URL}/api/auth/dev-token-latest`);
            if (response.ok) {
              const { token } = await response.json();
              await AsyncStorage.setItem(this.tokenKey, token);
              
              const verifyResult = await this.verifyToken();
              if (verifyResult.valid) {
                return { success: true, user: verifyResult.user };
              }
            }
          } catch (error) {
            console.error('Error retrieving dev token:', error);
          }
        }
        
        if (result.type === 'cancel') {
          return { success: false, error: 'Authentication cancelled by user' };
        }
        return { success: false, error: 'Authentication failed - please try again' };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: String(error) };
    }
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    try {
      const data: any = await api.post('/auth/verify');
      return data as VerifyTokenResponse;
    } catch (error: any) {
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