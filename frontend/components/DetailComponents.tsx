/**
 * Reusable Detail Screen Components
 * For customer, dog, and appointment detail views
 */

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

// Header Card Component (profile/avatar display)
interface DetailHeaderCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  name: string;
  subtitle?: string;
}

export function DetailHeaderCard({ icon, iconColor = colors.primary, name, subtitle }: DetailHeaderCardProps) {
  return (
    <View style={styles.headerCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={40} color={iconColor} />
      </View>
      <Text style={styles.name}>{name}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

// Section Container Component
interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// Info Row Component (icon + label + value)
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value: string;
  isLast?: boolean;
}

export function InfoRow({ icon, iconColor = colors.primary, label, value, isLast = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <View style={[styles.infoIconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// Action Button Component (for quick actions)
interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

export function ActionButton({ icon, iconColor = colors.primary, label, onPress, isLast = false }: ActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.actionButton, isLast && styles.actionButtonLast]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={styles.actionButtonText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

// Button Container Component (edit + delete)
interface DetailButtonContainerProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
}

export function DetailButtonContainer({ onEdit, onDelete, editLabel = "Edit" }: DetailButtonContainerProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="pencil" size={20} color={colors.surface} />
        <Text style={styles.editButtonText}>{editLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

// Loading State Component
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

// Error State Component
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel = "Retry" }: ErrorStateProps) {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.surface,
    margin: spacing.base,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.medium,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  name: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    margin: spacing.base,
    marginTop: 0,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.base,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.base,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButtonLast: {
    borderBottomWidth: 0,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    margin: spacing.base,
    marginTop: 0,
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.base,
    gap: spacing.sm,
    ...shadows.small,
  },
  editButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  deleteButton: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.error,
    ...shadows.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.base,
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.base,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
