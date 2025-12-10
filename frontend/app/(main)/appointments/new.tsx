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
  useWindowDimensions,
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
  AppointmentDateTimePicker,
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
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
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
  const [appointments, setAppointments] = useState<{ dateTime: string; durationMinutes: number }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersData, dogsData, appointmentsData] = await Promise.all([
        customerService.getAll(),
        dogService.getAll(),
        appointmentService.getAll(),
      ]);
      setCustomers(customersData);
      setDogs(dogsData);
      setAppointments(appointmentsData.map(apt => ({
        dateTime: apt.dateTime,
        durationMinutes: apt.durationMinutes,
      })));
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load customers and dogs");
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
      
      router.replace('/appointments');
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

  const handleCostChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    let formatted = parts[0];
    if (parts.length > 1) {
      formatted += '.' + parts.slice(1).join('').substring(0, 2);
    }
    
    updateField("cost", formatted);
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

  const durationOptions = [
    { label: "15 minutes", value: "15" },
    { label: "30 minutes", value: "30" },
    { label: "45 minutes", value: "45" },
    { label: "60 minutes (1 hour)", value: "60" },
    { label: "75 minutes", value: "75" },
    { label: "90 minutes (1.5 hours)", value: "90" },
    { label: "105 minutes", value: "105" },
    { label: "120 minutes (2 hours)", value: "120" },
  ];

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

        <View style={[styles.form, isDesktop && styles.formDesktop]}>
          <FormSection title="Customer & Pet">
            <View style={isDesktop ? styles.rowDesktop : undefined}>
              <View style={isDesktop ? styles.fieldHalf : undefined}>
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
              </View>

              <View style={isDesktop ? styles.fieldHalf : undefined}>
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
              </View>
            </View>
          </FormSection>

          <FormSection title="Appointment Details">
            <AppointmentDateTimePicker
              label="Date & Time"
              value={formData.dateTime}
              onValueChange={(value) => updateField("dateTime", value)}
              error={errors.dateTime}
              required
              existingAppointments={appointments}
            />

            <View style={isDesktop ? styles.rowDesktop : undefined}>
              <View style={isDesktop ? styles.fieldHalf : undefined}>
                <SelectField
                  label="Duration"
                  icon="hourglass"
                  value={formData.durationMinutes}
                  onValueChange={(value) => updateField("durationMinutes", value)}
                  options={durationOptions}
                  error={errors.durationMinutes}
                  required
                />
              </View>

              <View style={isDesktop ? styles.fieldHalf : undefined}>
                <FormField
                  label="Cost ($)"
                  value={formData.cost}
                  onChangeText={handleCostChange}
                  placeholder="50.00"
              keyboardType="decimal-pad"
              icon="pricetag"
              error={errors.cost}
              required
            />
              </View>
            </View>

            <View style={isDesktop ? styles.rowDesktop : undefined}>
              <View style={isDesktop ? styles.fieldHalf : undefined}>
                <SelectField
                  label="Status"
              icon="checkmark-circle"
              value={formData.status}
              onValueChange={(value) => updateField("status", value as any)}
              options={statusOptions}
            />
              </View>

              <View style={isDesktop ? styles.fieldHalf : undefined}>
                <SelectField
                  label="Payment Status"
              icon="card"
              value={formData.paymentStatus}
              onValueChange={(value) => updateField("paymentStatus", value as any)}
              options={paymentStatusOptions}
            />
              </View>
            </View>

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
  formDesktop: {
    maxWidth: 900,
    marginHorizontal: "auto" as any,
    width: "100%",
  },
  rowDesktop: {
    flexDirection: "row",
    gap: spacing.lg,
    marginHorizontal: -spacing.sm,
  },
  fieldHalf: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
});
