import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from "../styles/theme";

export default function Dashboard() {
  const router = useRouter();
  
  // State for statistics (you'll fetch these from your API later)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDogs: 0,
    upcomingAppointments: 0,
    todayAppointments: 0,
  });

  // TODO: Fetch statistics from your backend
  useEffect(() => {
    // Example: fetchDashboardStats();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Quick Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="today" size={iconSizes.lg} color={colors.purple} />
          <Text style={styles.statNumber}>{stats.todayAppointments}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Today</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="calendar" size={iconSizes.lg} color={colors.accent} />
          <Text style={styles.statNumber}>{stats.upcomingAppointments}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Upcoming</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people" size={iconSizes.lg} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.totalCustomers}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Customers</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="paw" size={iconSizes.lg} color={colors.secondary} />
          <Text style={styles.statNumber}>{stats.totalDogs}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Dogs</Text>
        </View>
      </View>

      {/* Main Navigation Cards */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        {/* Appointments Card */}
        <Pressable 
          style={styles.navCard}
          onPress={() => router.push("/appointments" as any)}
        >
          <View style={[styles.navIconContainer, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="calendar-outline" size={iconSizes.xl} color={colors.accent} />
          </View>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>Appointments</Text>
            <Text style={styles.navDescription}>
              View and manage all appointments
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
        </Pressable>

        {/* Customers Card */}
        <Pressable 
          style={styles.navCard}
          onPress={() => router.push("/customers" as any)}
        >
          <View style={[styles.navIconContainer, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="people-outline" size={iconSizes.xl} color={colors.primary} />
          </View>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>Customers</Text>
            <Text style={styles.navDescription}>
              Manage customer information
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
        </Pressable>

        {/* Dogs Card */}
        <Pressable 
          style={styles.navCard}
          onPress={() => router.push("/dogs" as any)}
        >
          <View style={[styles.navIconContainer, { backgroundColor: colors.secondaryLight }]}>
            <Ionicons name="paw-outline" size={iconSizes.xl} color={colors.secondary} />
          </View>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>Dogs</Text>
            <Text style={styles.navDescription}>
              View and manage dog profiles
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
        </Pressable>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push("/appointments/new" as any)}
          >
            <Ionicons name="add-circle" size={iconSizes.base} color={colors.accent} />
            <Text style={styles.quickActionText}>New Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push("/customers/new" as any)}
          >
            <Ionicons name="person-add" size={iconSizes.base} color={colors.primary} />
            <Text style={styles.quickActionText}>New Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push("/dogs/new" as any)}
          >
            <Ionicons name="paw" size={iconSizes.base} color={colors.secondary} />
            <Text style={styles.quickActionText}>New Dog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.medium,
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  navigationSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.base,
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  navIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  navContent: {
    flex: 1,
  },
  navTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  navDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  quickActionsSection: {
    marginBottom: spacing.lg,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.medium,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
  },
});
