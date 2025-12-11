/**
 * Dog Detail Screen
 * View and edit dog information
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dogService, Dog } from "../../../services/dogService";
import { customerService, Customer } from "../../../services/customerService";
import { colors, spacing, typography, borderRadius, shadows } from "../../../styles/theme";
import {
  DetailHeaderCard,
  DetailSection,
  InfoRow,
  ActionButton,
  DetailButtonContainer,
} from "../../../components/DetailComponents";
import { LoadingState, ErrorState } from "../../../components/StateComponents";
import { Ionicons } from "@expo/vector-icons";

export default function DogDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [dog, setDog] = useState<Dog | null>(null);
  const [owner, setOwner] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDog = async () => {
    try {
      setLoading(true);
      setError(null);
      const dogData = await dogService.getById(id as string);
      setDog(dogData);
      
      // Owner information is already populated by the backend
      setOwner(dogData.ownerId);
    } catch (err) {
      console.error("Error fetching dog:", err);
      setError("Failed to load dog details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Dog",
      `Are you sure you want to delete ${dog?.name}? This action cannot be undone.`,
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
              await dogService.delete(id as string);
              router.back();
            } catch (err) {
              console.error("Error deleting dog:", err);
              Alert.alert("Error", "Failed to delete dog");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingState message="Loading dog..." />;
  }

  if (error || !dog) {
    return <ErrorState message={error || "Dog not found"} onRetry={fetchDog} />;
  }

  const calculateAge = (dob?: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const age = calculateAge(dog.dob);

  return (
    <ScrollView style={styles.container} contentContainerStyle={isDesktop ? styles.desktopContainer : undefined}>
      <View style={isDesktop ? styles.contentWrapper : undefined}>
        <DetailHeaderCard
          icon="paw"
          iconColor={colors.secondary}
          name={dog.name}
          subtitle={dog.breed || "Mixed Breed"}
        />

      {/* Owner Information */}
      {owner && (
        <TouchableOpacity 
          style={styles.ownerCard}
          onPress={() => router.push(`/customers/${owner._id}`)}
        >
          <View style={styles.ownerIconContainer}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerLabel}>Owner</Text>
            <Text style={styles.ownerName}>{owner.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      {/* Basic Information */}
      <DetailSection title="Basic Information">
        {dog.sex && dog.sex !== "unknown" && (
          <InfoRow 
            icon="information-circle" 
            label="Sex" 
            value={dog.sex.charAt(0).toUpperCase() + dog.sex.slice(1)} 
            isLast={!age && !dog.color && !dog.weight}
          />
        )}
        {age && (
          <InfoRow 
            icon="calendar" 
            label="Age" 
            value={age}
            isLast={!dog.color && !dog.weight}
          />
        )}
        {dog.color && (
          <InfoRow 
            icon="color-palette" 
            label="Color" 
            value={dog.color}
            isLast={!dog.weight}
          />
        )}
        {dog.weight && (
          <InfoRow 
            icon="barbell" 
            label="Weight" 
            value={`${dog.weight} lbs`}
            isLast
          />
        )}
      </DetailSection>

      {/* Medical Information */}
      {(dog.vet || dog.medicalInfo || dog.rabiesVaccineDate || dog.areVaccinesCurrent !== undefined || dog.isFixed !== undefined) && (
        <DetailSection title="Medical Information">
          {dog.vet && (
            <InfoRow 
              icon="medical" 
              iconColor={colors.accent}
              label="Veterinarian" 
              value={dog.vet}
              isLast={!dog.rabiesVaccineDate && !dog.areVaccinesCurrent && !dog.isFixed && !dog.medicalInfo}
            />
          )}
          {dog.rabiesVaccineDate && (
            <InfoRow 
              icon="shield-checkmark" 
              iconColor={colors.accent}
              label="Rabies Vaccine Date" 
              value={new Date(dog.rabiesVaccineDate).toLocaleDateString()}
              isLast={!dog.areVaccinesCurrent && !dog.isFixed && !dog.medicalInfo}
            />
          )}
          {dog.areVaccinesCurrent !== undefined && (
            <InfoRow 
              icon="checkmark-circle" 
              iconColor={dog.areVaccinesCurrent ? colors.accent : colors.error}
              label="Vaccines Current" 
              value={dog.areVaccinesCurrent ? "Yes" : "No"}
              isLast={!dog.isFixed && !dog.medicalInfo}
            />
          )}
          {dog.isFixed !== undefined && (
            <InfoRow 
              icon="cut" 
              iconColor={colors.accent}
              label="Spayed/Neutered" 
              value={dog.isFixed ? "Yes" : "No"}
              isLast={!dog.medicalInfo}
            />
          )}
          {dog.medicalInfo && (
            <InfoRow 
              icon="document-text" 
              iconColor={colors.accent}
              label="Medical Notes" 
              value={dog.medicalInfo}
              isLast
            />
          )}
        </DetailSection>
      )}

      {/* Temperament & Notes */}
      {(dog.temperament || dog.notes) && (
        <DetailSection title="Additional Information">
          {dog.temperament && (
            <InfoRow 
              icon="happy" 
              label="Temperament" 
              value={dog.temperament}
              isLast={!dog.notes}
            />
          )}
          {dog.notes && (
            <InfoRow 
              icon="clipboard" 
              label="Notes" 
              value={dog.notes}
              isLast
            />
          )}
        </DetailSection>
      )}

      {/* Quick Actions */}
      <DetailSection title="Quick Actions">
        <ActionButton 
          icon="calendar" 
          iconColor={colors.primary} 
          label="Schedule Appointment" 
          onPress={() => {}} 
        />
        <ActionButton 
          icon="time" 
          iconColor={colors.accent} 
          label="Appointment History" 
          onPress={() => {}} 
          isLast 
        />
      </DetailSection>

      <DetailButtonContainer onEdit={() => {}} onDelete={handleDelete} editLabel="Edit Dog" />

      <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  desktopContainer: {
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    margin: spacing.base,
    marginTop: 0,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  ownerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  ownerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
