import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import { colors, spacing, typography } from '../../styles/theme';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the initial URL (should contain the token)
        const url = await Linking.getInitialURL();
        let token = null;
        if (url) {
          const data = Linking.parse(url);
          const tokenParam = data.queryParams?.token;
          token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
        }
        if (token) {
          await AsyncStorage.setItem('userToken', token);
        }
        // Now verify the token
        const result = await authService.verifyToken();
        if (result.valid) {
          setTimeout(() => {
            router.replace('/');
          }, 1000);
        } else {
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
    };
    handleCallback();
  }, [router]);

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
