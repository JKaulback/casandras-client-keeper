/**
 * DateTime Field Component
 * Simple date/time input with platform-specific rendering
 * Note: For appointment booking, use AppointmentDateTimePicker instead
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

interface DateTimeFieldProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  iconColor?: string;
}

export function DateTimeField({
  label,
  icon,
  value,
  onValueChange,
  error,
  required = false,
  iconColor = colors.textSecondary,
}: DateTimeFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDisplayValue = (dateString: string) => {
    if (!dateString) return "Select date and time";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={[styles.pickerContainer, error && styles.inputError]}>
          <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            style={styles.picker as any}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Native implementation
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.pickerContainer, error && styles.inputError]}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {formatDisplayValue(value)}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showDatePicker || showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowDatePicker(false);
          setShowTimePicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showDatePicker ? "Select Date" : "Select Time"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onValueChange}
                placeholder="YYYY-MM-DDTHH:MM"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.helperText}>
                Enter date and time in format: YYYY-MM-DDTHH:MM{"\n"}
                Example: 2025-12-08T14:30
              </Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  picker: {
    flex: 1,
    outline: "none",
    backgroundColor: "transparent",
    fontSize: typography.fontSize.base,
    color: colors.text,
    padding: spacing.sm,
  },
  pickerText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  icon: {
    marginRight: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  datePickerContainer: {
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: spacing.md,
  },
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  confirmButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
