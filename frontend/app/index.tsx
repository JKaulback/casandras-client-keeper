import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { colors, spacing, typography } from "../styles/theme";
import { StatCard, NavCard, QuickActionButton } from "../components/DashboardComponents";

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
        <StatCard
          icon="today"
          count={stats.todayAppointments}
          label="Today"
          color={colors.purple}
        />
        <StatCard
          icon="calendar"
          count={stats.upcomingAppointments}
          label="Upcoming"
          color={colors.accent}
        />
        <StatCard
          icon="people"
          count={stats.totalCustomers}
          label="Customers"
          color={colors.primary}
        />
        <StatCard
          icon="paw"
          count={stats.totalDogs}
          label="Dogs"
          color={colors.secondary}
        />
      </View>

      {/* Main Navigation Cards */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <NavCard
          icon="calendar-outline"
          title="Appointments"
          description="View and manage all appointments"
          backgroundColor={colors.accentLight}
          iconColor={colors.accent}
          onPress={() => router.push("/appointments" as any)}
        />

        <NavCard
          icon="people-outline"
          title="Customers"
          description="Manage customer information"
          backgroundColor={colors.primaryLight}
          iconColor={colors.primary}
          onPress={() => router.push("/customers" as any)}
        />

        <NavCard
          icon="paw-outline"
          title="Dogs"
          description="View and manage dog profiles"
          backgroundColor={colors.secondaryLight}
          iconColor={colors.secondary}
          onPress={() => router.push("/dogs" as any)}
        />
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            icon="add-circle"
            label="New Appointment"
            color={colors.accent}
            onPress={() => router.push("/appointments/new" as any)}
          />

          <QuickActionButton
            icon="person-add"
            label="New Customer"
            color={colors.primary}
            onPress={() => router.push("/customers/new" as any)}
          />

          <QuickActionButton
            icon="paw"
            label="New Dog"
            color={colors.secondary}
            onPress={() => router.push("/dogs/new" as any)}
          />
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
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
    gap: spacing.md,
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
  quickActionsSection: {
    marginBottom: spacing.lg,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
});
