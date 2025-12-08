/**
 * Multi-Select Temperament Field Component
 * Allows selecting multiple temperament options with an "Other" text input
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

interface MultiSelectTemperamentProps {
  label: string;
  value: string; // Comma-separated values
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const TEMPERAMENT_OPTIONS = [
  "Easy",
  "Fair",
  "Difficult",
  "Nervous",
  "Hyper",
  "Noisy",
  "Other",
];

export function MultiSelectTemperament({
  label,
  value,
  onValueChange,
  error,
  required = false,
}: MultiSelectTemperamentProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [otherText, setOtherText] = useState("");

  // Parse the comma-separated value into an array
  const selectedValues = value ? value.split(",").map(v => v.trim()).filter(Boolean) : [];
  
  // Check if "Other" is selected and extract custom text
  const hasOther = selectedValues.some(v => v.startsWith("Other:") || v === "Other");
  const otherValue = selectedValues.find(v => v.startsWith("Other:"))?.replace("Other:", "").trim() || "";

  const formatDisplayValue = () => {
    if (selectedValues.length === 0) return "Select temperament";
    
    return selectedValues.map(v => {
      if (v.startsWith("Other:")) {
        return v.replace("Other:", "Other: ");
      }
      return v;
    }).join(", ");
  };

  const toggleOption = (option: string) => {
    let newValues = [...selectedValues];
    
    if (option === "Other") {
      // Handle "Other" specially
      if (hasOther) {
        // Remove "Other" and any custom text
        newValues = newValues.filter(v => !v.startsWith("Other:") && v !== "Other");
        setOtherText("");
      } else {
        // Add "Other"
        newValues.push("Other");
      }
    } else {
      // Toggle regular option
      const index = newValues.indexOf(option);
      if (index > -1) {
        newValues.splice(index, 1);
      } else {
        newValues.push(option);
      }
    }
    
    onValueChange(newValues.join(", "));
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    
    // Update the value with the custom text
    let newValues = selectedValues.filter(v => !v.startsWith("Other:") && v !== "Other");
    
    if (text.trim()) {
      newValues.push(`Other:${text.trim()}`);
    } else if (hasOther) {
      // If text is cleared but "Other" was selected, keep "Other" without text
      newValues.push("Other");
    }
    
    onValueChange(newValues.join(", "));
  };

  const handleOpenPicker = () => {
    // Initialize otherText from current value
    if (otherValue) {
      setOtherText(otherValue);
    }
    setShowPicker(true);
  };

  const isSelected = (option: string) => {
    if (option === "Other") {
      return hasOther;
    }
    return selectedValues.includes(option);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.pickerContainer, error && styles.inputError]}
        onPress={handleOpenPicker}
      >
        <Ionicons name="happy-outline" size={20} color={colors.textSecondary} style={styles.icon} />
        <Text style={[styles.pickerText, selectedValues.length === 0 && styles.placeholderText]}>
          {formatDisplayValue()}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Temperament</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {TEMPERAMENT_OPTIONS.map((option) => (
                <View key={option}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => toggleOption(option)}
                  >
                    <View style={[styles.checkbox, isSelected(option) && styles.checkboxSelected]}>
                      {isSelected(option) && (
                        <Ionicons name="checkmark" size={16} color={colors.surface} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>

                  {option === "Other" && hasOther && (
                    <View style={styles.otherInputContainer}>
                      <TextInput
                        style={styles.otherInput}
                        placeholder="Specify other temperament..."
                        placeholderTextColor={colors.textSecondary}
                        value={otherText}
                        onChangeText={handleOtherTextChange}
                        autoCapitalize="sentences"
                      />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
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
  optionsContainer: {
    maxHeight: 400,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    flex: 1,
  },
  otherInputContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  otherInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  buttonContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  doneButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  doneButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
