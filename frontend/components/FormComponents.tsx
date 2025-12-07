/**
 * Reusable Form Components
 * For creating and editing forms
 */

import React from "react";
import { View, Text, StyleSheet, TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

// Form Header Component
interface FormHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
}

export function FormHeader({ icon, iconColor = colors.primary, title, subtitle }: FormHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={32} color={iconColor} />
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// Form Field Component
interface FormFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  required?: boolean;
  iconColor?: string;
}

export function FormField({
  label,
  icon,
  error,
  required = false,
  iconColor = colors.textSecondary,
  ...textInputProps
}: FormFieldProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color={iconColor} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          {...textInputProps}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
