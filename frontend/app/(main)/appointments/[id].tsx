/**
 * Appointment Detail Screen
 * View and edit appointment information
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { Customer } from "../../../services/customerService";
import { Dog } from "../../../services/dogService";
import { colors, spacing } from "../../../styles/theme";
import {
  DetailHeaderCard,
  DetailSection,
  InfoRow,
  ActionButton,
  DetailButtonContainer,
} from "../../../components/DetailComponents";
import { LoadingState, ErrorState } from "../../../components/StateComponents";

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError(null);
      const appointmentData = await appointmentService.getById(id as string);
      setAppointment(appointmentData);

      setCustomer(appointmentData.customerId);
      setDog(appointmentData.dogId);
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
        <InfoRow icon="calendar" label="Date" value={formatDateTime(appointment.dateTime)} />
        <InfoRow icon="time" label="Time" value={formatTime(appointment.dateTime)} />
        <InfoRow
          icon="hourglass"
          label="Duration"
          value={`${appointment.durationMinutes} minutes`}
        />
        <InfoRow icon="pricetag" label="Cost" value={`$${appointment.cost.toFixed(2)}`} isLast />
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
        />
        <InfoRow
          icon="card"
          label="Payment Status"
          value={getPaymentStatusLabel(appointment.paymentStatus)}
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
          <InfoRow icon="document-text" label="Notes" value={appointment.notes} isLast />
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
});
