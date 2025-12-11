/**
 * ResponsiveFormContainer Component
 * Provides a consistent, responsive layout for all forms
 * Adapts to screen size and handles keyboard behavior
 */

import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "../styles/theme";

interface ResponsiveFormContainerProps {
  children: ReactNode;
  maxWidth?: number;
}

export function ResponsiveFormContainer({
  children,
  maxWidth = 900,
}: ResponsiveFormContainerProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.form,
            isDesktop && { maxWidth, marginHorizontal: "auto" as any, width: "100%" },
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FormRowProps {
  children: ReactNode;
  columns?: number;
}

/**
 * FormRow Component
 * Creates a responsive row that stacks vertically on mobile
 * and displays horizontally on desktop
 */
export function FormRow({ children, columns = 2 }: FormRowProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  if (!isDesktop) {
    return <>{children}</>;
  }

  return <View style={styles.rowDesktop}>{children}</View>;
}

interface FormColumnProps {
  children: ReactNode;
  flex?: number;
}

/**
 * FormColumn Component
 * Individual column within a FormRow
 * Full width on mobile, fractional width on desktop
 */
export function FormColumn({ children, flex = 1 }: FormColumnProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  if (!isDesktop) {
    return <>{children}</>;
  }

  return <View style={[styles.columnDesktop, { flex }]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  form: {
    padding: spacing.lg,
  },
  rowDesktop: {
    flexDirection: "row",
    gap: spacing.lg,
    marginHorizontal: -spacing.sm,
  },
  columnDesktop: {
    marginHorizontal: spacing.sm,
  },
});
