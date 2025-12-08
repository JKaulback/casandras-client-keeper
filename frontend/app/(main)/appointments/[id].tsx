/**
 * Appointment Detail Screen
 * View and edit appointment information
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { Customer } from "../../../services/customerService";
import { Dog } from "../../../services/dogService";
import { colors, spacing, typography, borderRadius, shadows } from "../../../styles/theme";
import {
  DetailHeaderCard,
  DetailSection,
  InfoRow,
  ActionButton,
  DetailButtonContainer,
} from "../../../components/DetailComponents";
import { LoadingState, ErrorState } from "../../../components/StateComponents";
import { AppointmentDateTimePicker } from "../../../components/AppointmentDateTimePicker";
import { SelectField, SelectOption } from "../../../components/FormComponents";
import { Ionicons } from "@expo/vector-icons";

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError(null);
      const appointmentData = await appointmentService.getById(id as string);
      setAppointment(appointmentData);

      setCustomer(appointmentData.customerId);
      setDog(appointmentData.dogId);
      
      // Fetch all appointments for conflict checking
      const allAppts = await appointmentService.getAll();
      setAllAppointments(allAppts.filter(apt => apt._id !== id));
    } catch (err) {
      console.error("Error fetching appointment:", err);
      setError("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await appointmentService.delete(id as string);
              router.back();
            } catch (err) {
              console.error("Error deleting appointment:", err);
              Alert.alert("Error", "Failed to delete appointment");
            }
          },
        },
      ]
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPaymentStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };
  
  const handleSaveEdit = async () => {
    if (!appointment || !editingField) return;
    
    try {
      let updateData: any = {};
      
      switch (editingField) {
        case "dateTime":
          updateData = { dateTime: editValue };
          break;
        case "duration":
          updateData = { durationMinutes: parseInt(editValue) };
          break;
        case "cost":
          updateData = { cost: parseFloat(editValue) };
          break;
        case "status":
          updateData = { status: editValue };
          break;
        case "paymentStatus":
          updateData = { paymentStatus: editValue };
          break;
        case "notes":
          updateData = { notes: editValue };
          break;
      }
      
      const updatedAppointment = await appointmentService.update(id as string, updateData);
      setAppointment(updatedAppointment);
      setEditingField(null);
      setEditValue("");
      Alert.alert("Success", "Appointment updated successfully");
    } catch (err) {
      console.error("Error updating appointment:", err);
      Alert.alert("Error", "Failed to update appointment");
    }
  };
  
  const statusOptions: SelectOption[] = [
    { label: "Scheduled", value: "scheduled" },
    { label: "Confirmed", value: "confirmed" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "No Show", value: "no-show" },
  ];
  
  const paymentStatusOptions: SelectOption[] = [
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Refunded", value: "refunded" },
  ];

  if (loading) {
    return <LoadingState message="Loading appointment..." />;
  }

  if (error || !appointment) {
    return <ErrorState message={error || "Appointment not found"} onRetry={fetchAppointment} />;
  }

  return (
    <ScrollView style={styles.container}>
      <DetailHeaderCard
        icon="calendar"
        name={`Appointment - ${getStatusLabel(appointment.status)}`}
        subtitle={`${formatDateTime(appointment.dateTime)} at ${formatTime(appointment.dateTime)}`}
      />

      <DetailSection title="Appointment Details">
        <InfoRow 
          icon="calendar" 
          label="Date" 
          value={formatDateTime(appointment.dateTime)} 
          editable
          onEdit={() => handleEditField("dateTime", appointment.dateTime)}
        />
        <InfoRow 
          icon="time" 
          label="Time" 
          value={formatTime(appointment.dateTime)} 
          editable
          onEdit={() => handleEditField("dateTime", appointment.dateTime)}
        />
        <InfoRow
          icon="hourglass"
          label="Duration"
          value={`${appointment.durationMinutes} minutes`}
          editable
          onEdit={() => handleEditField("duration", String(appointment.durationMinutes))}
        />
        <InfoRow 
          icon="pricetag" 
          label="Cost" 
          value={`$${appointment.cost.toFixed(2)}`} 
          editable
          onEdit={() => handleEditField("cost", String(appointment.cost))}
          isLast 
        />
      </DetailSection>

      <DetailSection title="Customer & Pet">
        <InfoRow
          icon="person"
          label="Customer"
          value={customer?.name || "Loading..."}
        />
        <InfoRow
          icon="paw"
          label="Dog"
          value={dog?.name || "Loading..."}
          isLast
        />
      </DetailSection>

      <DetailSection title="Status & Payment">
        <InfoRow
          icon="checkmark-circle"
          label="Status"
          value={getStatusLabel(appointment.status)}
          editable
          onEdit={() => handleEditField("status", appointment.status)}
        />
        <InfoRow
          icon="card"
          label="Payment Status"
          value={getPaymentStatusLabel(appointment.paymentStatus)}
          editable
          onEdit={() => handleEditField("paymentStatus", appointment.paymentStatus)}
          isLast={!appointment.transactionId}
        />
        {appointment.transactionId && (
          <InfoRow
            icon="receipt"
            label="Transaction ID"
            value={appointment.transactionId}
            isLast
          />
        )}
      </DetailSection>

      {appointment.notes && (
        <DetailSection title="Notes">
          <InfoRow 
            icon="document-text" 
            label="Notes" 
            value={appointment.notes} 
            editable
            onEdit={() => handleEditField("notes", appointment.notes || "")}
            isLast 
          />
        </DetailSection>
      )}

      {appointment.isRecurring && appointment.recurrenceRule && (
        <DetailSection title="Recurrence">
          <InfoRow
            icon="repeat"
            label="Frequency"
            value={
              appointment.recurrenceRule.frequency
                ? getStatusLabel(appointment.recurrenceRule.frequency)
                : "N/A"
            }
          />
          <InfoRow
            icon="refresh"
            label="Interval"
            value={`Every ${appointment.recurrenceRule.interval || 1} ${
              appointment.recurrenceRule.frequency || ""
            }(s)`}
          />
          {appointment.recurrenceRule.endDate && (
            <InfoRow
              icon="calendar-outline"
              label="End Date"
              value={formatDateTime(appointment.recurrenceRule.endDate)}
              isLast
            />
          )}
        </DetailSection>
      )}

      {appointment.conflictFlag && (
        <DetailSection title="Conflict Information">
          <InfoRow
            icon="warning"
            label="Conflict Detected"
            value={appointment.conflictNote || "Yes"}
            isLast
          />
        </DetailSection>
      )}

      <DetailSection title="Quick Actions">
        <ActionButton
          icon="person"
          iconColor={colors.primary}
          label="View Customer"
          onPress={() => customer && router.push(`/customers/${customer._id}`)}
        />
        <ActionButton
          icon="paw"
          iconColor={colors.secondary}
          label="View Dog"
          onPress={() => dog && router.push(`/dogs/${dog._id}`)}
        />
        <ActionButton
          icon="calendar"
          iconColor={colors.accent}
          label="Reschedule"
          onPress={() => {}}
          isLast
        />
      </DetailSection>

      <DetailButtonContainer
        onEdit={() => {}}
        onDelete={handleDelete}
        editLabel="Edit Appointment"
      />

      <View style={styles.bottomSpacer} />
      
      {/* Edit Modal */}
      <Modal
        visible={editingField !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editingField === "dateTime" ? "Date & Time" : 
                      editingField === "duration" ? "Duration" :
                      editingField === "cost" ? "Cost" :
                      editingField === "status" ? "Status" :
                      editingField === "paymentStatus" ? "Payment Status" :
                      editingField === "notes" ? "Notes" : ""}
              </Text>
              <TouchableOpacity onPress={() => setEditingField(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              {editingField === "dateTime" && (
                <AppointmentDateTimePicker
                  label="Date & Time"
                  value={editValue}
                  onValueChange={setEditValue}
                  existingAppointments={allAppointments.map(apt => ({
                    dateTime: apt.dateTime,
                    durationMinutes: apt.durationMinutes
                  }))}
                />
              )}
              
              {editingField === "duration" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="numeric"
                    placeholder="Enter duration in minutes"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              )}
              
              {editingField === "cost" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cost ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="decimal-pad"
                    placeholder="Enter cost"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              )}
              
              {editingField === "status" && (
                <SelectField
                  label="Status"
                  icon="checkmark-circle"
                  value={editValue}
                  onValueChange={setEditValue}
                  options={statusOptions}
                />
              )}
              
              {editingField === "paymentStatus" && (
                <SelectField
                  label="Payment Status"
                  icon="card"
                  value={editValue}
                  onValueChange={setEditValue}
                  options={paymentStatusOptions}
                />
              )}
              
              {editingField === "notes" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editValue}
                    onChangeText={setEditValue}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter notes"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              )}
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomSpacer: {
    height: spacing.xl,
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
    maxHeight: "80%",
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
  modalBody: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
