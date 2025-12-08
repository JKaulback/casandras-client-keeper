/**
 * New Dog Screen
 * Form to create a new dog
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { dogService } from "../../../services/dogService";
import { customerService, Customer } from "../../../services/customerService";
import { colors, spacing } from "../../../styles/theme";
import { FormHeader, FormField, FormSection, FormActions, SelectField, SelectOption } from "../../../components/FormComponents";
import { SimpleDatePicker } from "../../../components/SimpleDatePicker";
import { MultiSelectTemperament } from "../../../components/MultiSelectTemperament";

interface FormData {
  ownerId: string;
  name: string;
  sex: 'male' | 'female' | 'unknown';
  breed: string;
  dob: string;
  color: string;
  weight: string;
  vet: string;
  medicalInfo: string;
  rabiesVaccineDate: string;
  areVaccinesCurrent: string;
  isFixed: string;
  temperament: string;
  notes: string;
}

interface FormErrors {
  ownerId?: string;
  name?: string;
}

export default function NewDogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<FormData>({
    ownerId: (params.ownerId as string) || "",
    name: "",
    sex: "unknown",
    breed: "",
    dob: "",
    color: "",
    weight: "",
    vet: "",
    medicalInfo: "",
    rabiesVaccineDate: "",
    areVaccinesCurrent: "",
    isFixed: "",
    temperament: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      Alert.alert("Error", "Failed to load customers");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerId) {
      newErrors.ownerId = "Owner is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Dog name is required";
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
      const dogData: any = {
        ownerId: formData.ownerId,
        name: formData.name.trim(),
        sex: formData.sex,
        ...(formData.breed.trim() && { breed: formData.breed.trim() }),
        ...(formData.dob && { dob: formData.dob }),
        ...(formData.color.trim() && { color: formData.color.trim() }),
        ...(formData.weight && { weight: parseFloat(formData.weight) }),
        ...(formData.vet.trim() && { vet: formData.vet.trim() }),
        ...(formData.medicalInfo.trim() && { medicalInfo: formData.medicalInfo.trim() }),
        ...(formData.rabiesVaccineDate && { rabiesVaccineDate: formData.rabiesVaccineDate }),
        ...(formData.areVaccinesCurrent && { areVaccinesCurrent: formData.areVaccinesCurrent === "true" }),
        ...(formData.isFixed && { isFixed: formData.isFixed === "true" }),
        ...(formData.temperament.trim() && { temperament: formData.temperament.trim() }),
        ...(formData.notes.trim() && { notes: formData.notes.trim() }),
      };

      const newDog = await dogService.create(dogData);
      
      // Navigate to the dog's detail page
      router.replace(`/dogs/${newDog._id}`);
    } catch (err) {
      console.error("Error creating dog:", err);
      Alert.alert("Error", "Failed to create dog. Please try again.");
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

  const customerOptions: SelectOption[] = customers.map(customer => ({
    label: customer.name,
    value: customer._id,
  }));

  const sexOptions: SelectOption[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Unknown", value: "unknown" },
  ];

  const booleanOptions: SelectOption[] = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <FormHeader
          icon="paw"
          title="New Dog"
          subtitle="Enter dog information below"
        />

        <FormSection title="Owner Information">
          <SelectField
            label="Owner"
            icon="person-outline"
            required
            placeholder="Select owner"
            value={formData.ownerId}
            onValueChange={(value) => updateField("ownerId", value)}
            options={customerOptions}
            error={errors.ownerId}
          />
        </FormSection>

        <FormSection title="Basic Information">
          <FormField
            label="Name"
            icon="paw"
            required
            placeholder="Enter dog name"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            autoCapitalize="words"
            returnKeyType="next"
            error={errors.name}
          />

          <SelectField
            label="Sex"
            icon="male-female-outline"
            placeholder="Select sex"
            value={formData.sex}
            onValueChange={(value) => updateField("sex", value)}
            options={sexOptions}
          />

          <FormField
            label="Breed"
            icon="search-outline"
            placeholder="Enter breed"
            value={formData.breed}
            onChangeText={(value) => updateField("breed", value)}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <SimpleDatePicker
            label="Date of Birth"
            icon="calendar-outline"
            value={formData.dob}
            onValueChange={(value) => updateField("dob", value)}
          />

          <FormField
            label="Color"
            icon="color-palette-outline"
            placeholder="Enter color"
            value={formData.color}
            onChangeText={(value) => updateField("color", value)}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <FormField
            label="Weight (lbs)"
            icon="scale-outline"
            placeholder="Enter weight"
            value={formData.weight}
            onChangeText={(value) => updateField("weight", value)}
            keyboardType="decimal-pad"
            returnKeyType="next"
          />
        </FormSection>

        <FormSection title="Medical Information">
          <FormField
            label="Veterinarian"
            icon="medical-outline"
            placeholder="Enter vet name/clinic"
            value={formData.vet}
            onChangeText={(value) => updateField("vet", value)}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <SimpleDatePicker
            label="Rabies Vaccine Date"
            icon="medical-outline"
            value={formData.rabiesVaccineDate}
            onValueChange={(value) => updateField("rabiesVaccineDate", value)}
          />

          <SelectField
            label="Vaccines Current?"
            icon="shield-checkmark-outline"
            placeholder="Select status"
            value={formData.areVaccinesCurrent}
            onValueChange={(value) => updateField("areVaccinesCurrent", value)}
            options={booleanOptions}
          />

          <SelectField
            label="Spayed/Neutered?"
            icon="cut-outline"
            placeholder="Select status"
            value={formData.isFixed}
            onValueChange={(value) => updateField("isFixed", value)}
            options={booleanOptions}
          />

          <FormField
            label="Medical Info"
            icon="clipboard-outline"
            placeholder="Enter medical conditions, allergies, etc."
            value={formData.medicalInfo}
            onChangeText={(value) => updateField("medicalInfo", value)}
            multiline
            numberOfLines={3}
            returnKeyType="next"
          />
        </FormSection>

        <FormSection title="Behavior">
          <MultiSelectTemperament
            label="Temperament"
            value={formData.temperament}
            onValueChange={(value) => updateField("temperament", value)}
          />

          <FormField
            label="Notes"
            icon="document-text-outline"
            placeholder="Additional notes"
            value={formData.notes}
            onChangeText={(value) => updateField("notes", value)}
            multiline
            numberOfLines={4}
            returnKeyType="done"
          />
        </FormSection>

        <FormActions
          onCancel={() => router.back()}
          onSubmit={handleSubmit}
          submitLabel="Create Dog"
          submitting={submitting}
        />

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
  bottomSpacer: {
    height: spacing.xl,
  },
});
