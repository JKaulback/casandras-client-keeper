/**
 * New Customer Screen
 * Form to create a new customer
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { customerService } from "../../../services/customerService";
import { colors, spacing, typography, borderRadius, shadows } from "../../../styles/theme";
import { FormHeader, FormField } from "../../../components/FormComponents";

interface FormData {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function NewCustomerScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    occupation: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const customerData = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, ""), // Send only digits to backend
        ...(formData.email.trim() && { email: formData.email.trim() }),
        ...(formData.occupation.trim() && { occupation: formData.occupation.trim() }),
        ...(formData.address.trim() && { address: formData.address.trim() }),
      };

      const newCustomer = await customerService.create(customerData);
      
      // Navigate to the new customer's detail page
      router.replace(`/customers/${newCustomer._id}`);
    } catch (err) {
      console.error("Error creating customer:", err);
      Alert.alert("Error", "Failed to create customer. Please try again.");
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    if (digits.length === 0) return "";
    
    // More than 10 digits - add country code
    if (digits.length > 10) {
      const countryCode = digits.slice(0, -10);
      const areaCode = digits.slice(-10, -7);
      const firstPart = digits.slice(-7, -4);
      const secondPart = digits.slice(-4);
      
      let formatted = `+${countryCode}`;
      if (areaCode) formatted += ` (${areaCode}`;
      if (firstPart) formatted += `) ${firstPart}`;
      if (secondPart) formatted += `-${secondPart}`;
      
      return formatted;
    }
    
    // 10 digits or less - standard US format
    const areaCode = digits.slice(0, 3);
    const firstPart = digits.slice(3, 6);
    const secondPart = digits.slice(6, 10);
    
    let formatted = "";
    if (areaCode) formatted = `(${areaCode}`;
    if (firstPart) formatted += `) ${firstPart}`;
    if (secondPart) formatted += `-${secondPart}`;
    
    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits and format automatically
    const formatted = formatPhoneNumber(value);
    updateField("phone", formatted);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <FormHeader
          icon="person-add"
          title="New Customer"
          subtitle="Enter customer information below"
        />

        <FormField
          label="Name"
          icon="person-outline"
          required
          placeholder="Enter customer name"
          value={formData.name}
          onChangeText={(value) => updateField("name", value)}
          autoCapitalize="words"
          returnKeyType="next"
          error={errors.name}
        />

        <FormField
          label="Phone"
          icon="call-outline"
          required
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          returnKeyType="next"
          error={errors.phone}
        />

        <FormField
          label="Email"
          icon="mail-outline"
          placeholder="email@example.com"
          value={formData.email}
          onChangeText={(value) => updateField("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          error={errors.email}
        />

        <FormField
          label="Occupation"
          icon="briefcase-outline"
          placeholder="Enter occupation"
          value={formData.occupation}
          onChangeText={(value) => updateField("occupation", value)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <FormField
          label="Address"
          icon="location-outline"
          placeholder="Enter address"
          value={formData.address}
          onChangeText={(value) => updateField("address", value)}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Text style={styles.submitButtonText}>Creating...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
                <Text style={styles.submitButtonText}>Create Customer</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.base,
    gap: spacing.sm,
    ...shadows.medium,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.base,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
