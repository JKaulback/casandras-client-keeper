/**
 * Reusable Dashboard Components
 */

import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from "../styles/theme";

// Stat Card Component
interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  color: string;
}

export function StatCard({ icon, count, label, color }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={iconSizes.lg} color={color} />
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// Navigation Card Component
interface NavCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}

export function NavCard({ icon, title, description, backgroundColor, iconColor, onPress }: NavCardProps) {
  return (
    <Pressable style={styles.navCard} onPress={onPress}>
      <View style={[styles.navIconContainer, { backgroundColor }]}>
        <Ionicons name={icon} size={iconSizes.xl} color={iconColor} />
      </View>
      <View style={styles.navContent}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
    </Pressable>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

export function QuickActionButton({ icon, label, color, onPress }: QuickActionButtonProps) {
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <Ionicons name={icon} size={iconSizes.base} color={color} />
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Stat Card Styles
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.medium,
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  // Nav Card Styles
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  navIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  navContent: {
    flex: 1,
  },
  navTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  navDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },

  // Quick Action Button Styles
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.medium,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
  },
});
