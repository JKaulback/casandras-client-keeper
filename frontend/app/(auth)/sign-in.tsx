import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import { colors, spacing, typography } from '../../styles/theme';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for deep links while on sign-in page
    const handleDeepLink = async (event: { url: string }) => {
      console.log('=== Deep link received on sign-in page ===');
      console.log('URL:', event.url);
      
      const data = Linking.parse(event.url);
      console.log('Parsed data:', JSON.stringify(data));
      
      const tokenParam = data.queryParams?.token;
      const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
      
      if (token) {
        console.log('Token found in deep link, storing...');
        console.log('Token:', token.substring(0, 20) + '...');
        await AsyncStorage.setItem('userToken', token);
        console.log('Token stored successfully in AsyncStorage');
      } else {
        console.log('No token found in deep link');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Also check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('Initial URL detected:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await authService.signInWithGoogle();

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Sign-in failed');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="cut" size={60} color={colors.primary} />
          <Text style={styles.title}>Scissors and Sudz</Text>
          <Text style={styles.subtitle}>Client Management</Text>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.googleButton, loading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="#fff" />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Sign in to manage your grooming appointments
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.base,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    gap: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});