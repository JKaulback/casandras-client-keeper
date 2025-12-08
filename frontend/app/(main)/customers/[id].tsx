/**
 * Customer Detail Screen
 * View and edit customer information
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { customerService, Customer } from "../../../services/customerService";
import { colors, spacing } from "../../../styles/theme";
import {
  DetailHeaderCard,
  DetailSection,
  InfoRow,
  ActionButton,
  DetailButtonContainer,
} from "../../../components/DetailComponents";
import { LoadingState, ErrorState } from "../../../components/StateComponents";

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getById(id as string);
      setCustomer(data);
    } catch (err) {
      console.error("Error fetching customer:", err);
      setError("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete ${customer?.name}? This action cannot be undone.`,
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
              await customerService.delete(id as string);
              router.back();
            } catch (err) {
              console.error("Error deleting customer:", err);
              Alert.alert("Error", "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingState message="Loading customer..." />;
  }

  if (error || !customer) {
    return <ErrorState message={error || "Customer not found"} onRetry={fetchCustomer} />;
  }

  return (
    <ScrollView style={styles.container}>
      <DetailHeaderCard
        icon="person"
        name={customer.name}
        subtitle={`Member since ${new Date(customer.createdAt || "").toLocaleDateString()}`}
      />

      <DetailSection title="Contact Information">
        <InfoRow icon="call" label="Phone" value={customer.phone} isLast={!customer.email && !customer.address && !customer.occupation} />
        {customer.email && (
          <InfoRow icon="mail" label="Email" value={customer.email} isLast={!customer.address && !customer.occupation} />
        )}
        {customer.address && (
          <InfoRow icon="location" label="Address" value={customer.address} isLast={!customer.occupation} />
        )}
        {customer.occupation && (
          <InfoRow icon="briefcase" label="Occupation" value={customer.occupation} isLast />
        )}
      </DetailSection>

      <DetailSection title="Quick Actions">
        <ActionButton icon="calendar" iconColor={colors.primary} label="Schedule Appointment" onPress={() => {}} />
        <ActionButton icon="paw" iconColor={colors.secondary} label="View Dogs" onPress={() => {}} />
        <ActionButton icon="time" iconColor={colors.accent} label="Appointment History" onPress={() => {}} isLast />
      </DetailSection>

      <DetailButtonContainer onEdit={() => {}} onDelete={handleDelete} editLabel="Edit Customer" />

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
