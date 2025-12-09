import { useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '../../services/authService';
import { colors, spacing, typography } from '../../styles/theme';

export default function AuthCallback() {
  const router = useRouter();

  const handleCallback = useCallback(async () => {
    try {
      // Verify the authentication was successful
      const result = await authService.verifyToken();

      if (result.valid) {
        // Authentication successful, redirect to home
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } else {
        // Authentication failed, redirect back to sign-in
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
      }
    } catch (error) {
      console.error('Callback error:', error);
      setTimeout(() => {
        router.replace('/(auth)/sign-in');
      }, 2000);
    }
  }, [router]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Completing sign-in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.base,
  },
  text: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.base,
  },
});
