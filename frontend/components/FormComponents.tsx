/**
 * Reusable Form Components
 * For creating and editing forms
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TextInputProps, TouchableOpacity, Platform, Modal, Pressable } from "react-native";
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

// Form Section Component
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
});

// Select Field Component
interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  iconColor?: string;
}

export function SelectField({
  label,
  icon,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  iconColor = colors.textSecondary,
}: SelectFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  if (Platform.OS === 'web') {
    return (
      <View style={selectStyles.field}>
        <Text style={selectStyles.label}>
          {label} {required && <Text style={selectStyles.required}>*</Text>}
        </Text>
        <View style={[selectStyles.pickerContainer, error && selectStyles.inputError]}>
          <Ionicons name={icon} size={20} color={iconColor} style={selectStyles.icon} />
          <select
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            style={selectStyles.picker as any}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </View>
        {error && <Text style={selectStyles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Native implementation
  return (
    <View style={selectStyles.field}>
      <Text style={selectStyles.label}>
        {label} {required && <Text style={selectStyles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[selectStyles.pickerContainer, error && selectStyles.inputError, disabled && selectStyles.disabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Ionicons name={icon} size={20} color={iconColor} style={selectStyles.icon} />
        <Text style={[selectStyles.pickerText, !value && selectStyles.placeholderText]}>
          {displayValue}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={selectStyles.errorText}>{error}</Text>}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable style={selectStyles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={selectStyles.modalContent}>
            <View style={selectStyles.modalHeader}>
              <Text style={selectStyles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={selectStyles.optionItem}
                onPress={() => {
                  onValueChange(option.value);
                  setShowPicker(false);
                }}
              >
                <Text style={selectStyles.optionText}>{option.label}</Text>
                {value === option.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const selectStyles = StyleSheet.create({
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
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: "70%",
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
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
});

// DateTime Field Component
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
      <View style={dateTimeStyles.field}>
        <Text style={dateTimeStyles.label}>
          {label} {required && <Text style={dateTimeStyles.required}>*</Text>}
        </Text>
        <View style={[dateTimeStyles.pickerContainer, error && dateTimeStyles.inputError]}>
          <Ionicons name={icon} size={20} color={iconColor} style={dateTimeStyles.icon} />
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            style={dateTimeStyles.picker as any}
          />
        </View>
        {error && <Text style={dateTimeStyles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Native implementation - simple text input that could be enhanced with a date picker library
  return (
    <View style={dateTimeStyles.field}>
      <Text style={dateTimeStyles.label}>
        {label} {required && <Text style={dateTimeStyles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[dateTimeStyles.pickerContainer, error && dateTimeStyles.inputError]}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name={icon} size={20} color={iconColor} style={dateTimeStyles.icon} />
        <Text style={[dateTimeStyles.pickerText, !value && dateTimeStyles.placeholderText]}>
          {formatDisplayValue(value)}
        </Text>
      </TouchableOpacity>
      {error && <Text style={dateTimeStyles.errorText}>{error}</Text>}

      <Modal
        visible={showDatePicker || showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowDatePicker(false);
          setShowTimePicker(false);
        }}
      >
        <View style={dateTimeStyles.modalOverlay}>
          <View style={dateTimeStyles.modalContent}>
            <View style={dateTimeStyles.modalHeader}>
              <Text style={dateTimeStyles.modalTitle}>
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
            <View style={dateTimeStyles.datePickerContainer}>
              <TextInput
                style={dateTimeStyles.input}
                value={value}
                onChangeText={onValueChange}
                placeholder="YYYY-MM-DDTHH:MM"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={dateTimeStyles.helperText}>
                Enter date and time in format: YYYY-MM-DDTHH:MM{"\n"}
                Example: 2025-12-08T14:30
              </Text>
            </View>
            <TouchableOpacity
              style={dateTimeStyles.confirmButton}
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker(false);
              }}
            >
              <Text style={dateTimeStyles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const dateTimeStyles = StyleSheet.create({
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

// Form Actions Component
interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitting = false,
}: FormActionsProps) {
  return (
    <View style={actionStyles.buttonContainer}>
      <TouchableOpacity style={actionStyles.cancelButton} onPress={onCancel}>
        <Text style={actionStyles.cancelButtonText}>{cancelLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[actionStyles.submitButton, submitting && actionStyles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={submitting}
      >
        <Ionicons name="checkmark" size={20} color={colors.surface} />
        <Text style={actionStyles.submitButtonText}>
          {submitting ? "Submitting..." : submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const actionStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadows.medium,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
});

