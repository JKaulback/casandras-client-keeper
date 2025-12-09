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
      console.log('Using API URL:', API_URL);
      console.log('Platform:', Platform.OS);
      console.log('__DEV__:', __DEV__);

      // For web, set up postMessage listener before opening auth window
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          const handleMessage = async (event: MessageEvent) => {
            if (event.data.type === 'auth_success' && event.data.token) {
              window.removeEventListener('message', handleMessage);
              
              // Store the token
              await AsyncStorage.setItem(this.tokenKey, event.data.token);
              console.log('Token received via postMessage and stored');
              
              // Verify the token
              const verifyResult = await this.verifyToken();
              if (verifyResult.valid) {
                resolve({ success: true, user: verifyResult.user });
              } else {
                resolve({ success: false, error: 'Token verification failed' });
              }
            }
          };
          
          window.addEventListener('message', handleMessage);
          
          // Open the auth popup
          const authUrl = `${API_URL}/api/auth/google`;
          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;
          
          window.open(
            authUrl,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          
          // Timeout after 5 minutes
          setTimeout(() => {
            window.removeEventListener('message', handleMessage);
            resolve({ success: false, error: 'Authentication timeout' });
          }, 5 * 60 * 1000);
        });
      }

      // Mobile flow
      // For development mode, we'll rely on cookies since deep links don't work in Chrome Custom Tabs
      // Just use a dummy redirect URI
      const redirectUri = 'exp://localhost:8081';

      console.log('Using redirect URI:', redirectUri);

      // Add mobile=true and redirect URI as query parameters
      const authUrl = `${API_URL}/api/auth/google?mobile=true&redirectUri=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      console.log('Auth session result:', JSON.stringify(result));

      // For mobile, the backend will redirect back with token in URL
      if (result.type === 'success' && result.url) {
        console.log('Success! Received URL:', result.url);
        // Parse token from the redirect URL
        const url = result.url;
        const match = url.match(/[?&]token=([^&]+)/);
        if (match) {
          const token = match[1];
          await AsyncStorage.setItem(this.tokenKey, token);
          console.log('Token stored successfully from success callback');
          
          // Verify the token
          const verifyResult = await this.verifyToken();
          if (verifyResult.valid) {
            return { success: true, user: verifyResult.user };
          }
        } else {
          console.log('No token found in success URL');
        }
      } else if (result.type === 'dismiss' || result.type === 'cancel') {
        // Browser was dismissed - user closed manually after authentication
        console.log('Browser dismissed/cancelled, checking authentication...');
        
        // In development mode, retrieve the token from the backend
        if (__DEV__ && Platform.OS !== 'windows') {
          console.log('Development mode - retrieving stored token from backend');
          
          // Wait a moment for the backend to store the token
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          try {
            // Fetch the latest dev token from backend
            const devTokenResponse = await fetch(`${API_URL}/api/auth/dev-token-latest`);
            
            if (devTokenResponse.ok) {
              const { token, email } = await devTokenResponse.json();
              console.log('Retrieved token for:', email);
              
              // Store the token
              await AsyncStorage.setItem(this.tokenKey, token);
              console.log('Token stored successfully from dev endpoint');
              
              // Verify the token
              const verifyResult = await this.verifyToken();
              if (verifyResult.valid) {
                console.log('Authentication successful!');
                return { success: true, user: verifyResult.user };
              }
            } else {
              const errorData = await devTokenResponse.json();
              console.log('Dev token not available:', errorData.error);
            }
          } catch (error) {
            console.log('Error retrieving dev token:', error);
          }
        } else {
          // Production mode or web - check for cookie-based authentication
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const verifyResult = await this.verifyToken();
          if (verifyResult.valid) {
            console.log('Authentication successful!');
            return { success: true, user: verifyResult.user };
          }
        }
        
        if (result.type === 'cancel') {
          return { success: false, error: 'Authentication cancelled by user' };
        }
        return { success: false, error: 'Authentication failed - please try again' };
      }

      // For web, check if auth succeeded via cookie
      if (Platform.OS === 'windows') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const verifyResult = await this.verifyToken();
        if (verifyResult.valid) {
          return { success: true, user: verifyResult.user };
        }
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: String(error) };
    }
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    try {
      // axios interceptor unwraps response.data, so this is already VerifyTokenResponse
      const data: any = await api.post('/api/auth/verify');
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
      await api.post('/api/auth/logout');
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