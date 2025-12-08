/**
 * New Appointment Screen
 * Form to create a new appointment
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
import { appointmentService } from "../../../services/appointmentService";
import { customerService, Customer } from "../../../services/customerService";
import { dogService, Dog } from "../../../services/dogService";
import { colors, spacing } from "../../../styles/theme";
import { 
  FormHeader, 
  FormField, 
  FormSection, 
  SelectField, 
  DateTimeField,
  FormActions 
} from "../../../components/FormComponents";

interface FormData {
  customerId: string;
  dogId: string;
  dateTime: string;
  durationMinutes: string;
  cost: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "partial";
}

interface FormErrors {
  customerId?: string;
  dogId?: string;
  dateTime?: string;
  durationMinutes?: string;
  cost?: string;
}

export default function NewAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState<FormData>({
    customerId: (params.customerId as string) || "",
    dogId: (params.dogId as string) || "",
    dateTime: "",
    durationMinutes: "60",
    cost: "50.00",
    notes: "",
    status: "confirmed",
    paymentStatus: "unpaid",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersData, dogsData] = await Promise.all([
        customerService.getAll(),
        dogService.getAll(),
      ]);
      setCustomers(customersData);
      setDogs(dogsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load customers and dogs");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }

    if (!formData.dogId) {
      newErrors.dogId = "Dog is required";
    }

    if (!formData.dateTime) {
      newErrors.dateTime = "Date and time is required";
    }

    const duration = parseInt(formData.durationMinutes);
    if (!duration || duration < 15 || duration > 240) {
      newErrors.durationMinutes = "Duration must be between 15 and 240 minutes";
    }

    const cost = parseFloat(formData.cost);
    if (isNaN(cost) || cost < 0) {
      newErrors.cost = "Cost must be a valid positive number";
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
      const appointmentData = {
        customerId: formData.customerId,
        dogId: formData.dogId,
        dateTime: new Date(formData.dateTime).toISOString(),
        durationMinutes: parseInt(formData.durationMinutes),
        cost: parseFloat(formData.cost),
        notes: formData.notes,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        isRecurring: false,
        conflictFlag: false,
      };

      await appointmentService.create(appointmentData as any);
      Alert.alert("Success", "Appointment created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getCustomerDogs = () => {
    if (!formData.customerId) return dogs;
    return dogs.filter((dog) => {
      const ownerId = typeof dog.ownerId === 'string' ? dog.ownerId : dog.ownerId._id;
      return ownerId === formData.customerId;
    });
  };

  const customerDogs = getCustomerDogs();

  const customerOptions = customers.map((customer) => ({
    label: customer.name,
    value: customer._id,
  }));

  const dogOptions = customerDogs.map((dog) => ({
    label: dog.name,
    value: dog._id,
  }));

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const paymentStatusOptions = [
    { label: "Unpaid", value: "unpaid" },
    { label: "Paid", value: "paid" },
    { label: "Partial", value: "partial" },
    { label: "Refunded", value: "refunded" },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormHeader
          title="New Appointment"
          subtitle="Schedule a new grooming appointment"
          icon="calendar"
        />

        <View style={styles.form}>
          <FormSection title="Customer & Pet">
            <SelectField
              label="Customer"
              icon="person"
              value={formData.customerId}
              onValueChange={(value) => {
                updateField("customerId", value);
                updateField("dogId", ""); // Reset dog when customer changes
              }}
              options={customerOptions}
              placeholder="Select a customer"
              error={errors.customerId}
              required
            />

            <SelectField
              label="Dog"
              icon="paw"
              value={formData.dogId}
              onValueChange={(value) => updateField("dogId", value)}
              options={dogOptions}
              placeholder="Select a dog"
              error={errors.dogId}
              required
              disabled={!formData.customerId}
            />
          </FormSection>

          <FormSection title="Appointment Details">
            <DateTimeField
              label="Date & Time"
              icon="calendar"
              value={formData.dateTime}
              onValueChange={(value) => updateField("dateTime", value)}
              error={errors.dateTime}
              required
            />

            <FormField
              label="Duration (minutes)"
              value={formData.durationMinutes}
              onChangeText={(value) => updateField("durationMinutes", value)}
              placeholder="60"
              keyboardType="numeric"
              icon="hourglass"
              error={errors.durationMinutes}
              required
            />

            <FormField
              label="Cost ($)"
              value={formData.cost}
              onChangeText={(value) => updateField("cost", value)}
              placeholder="50.00"
              keyboardType="decimal-pad"
              icon="pricetag"
              error={errors.cost}
              required
            />

            <SelectField
              label="Status"
              icon="checkmark-circle"
              value={formData.status}
              onValueChange={(value) => updateField("status", value as any)}
              options={statusOptions}
            />

            <SelectField
              label="Payment Status"
              icon="card"
              value={formData.paymentStatus}
              onValueChange={(value) => updateField("paymentStatus", value as any)}
              options={paymentStatusOptions}
            />

            <FormField
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => updateField("notes", value)}
              placeholder="Add any special instructions or notes..."
              multiline
              numberOfLines={4}
              icon="document-text"
            />
          </FormSection>

          <FormActions
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            submitLabel="Create Appointment"
            submitting={submitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
});
