/**
 * Settings Screen
 * Configure app preferences and business settings
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value?: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  // State for switches
  const [darkMode, setDarkMode] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [conflictAlerts, setConflictAlerts] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleComingSoon = (feature: string) => {
    Alert.alert("Coming Soon", `${feature} will be available in a future update.`);
  };

  const sections: SettingSection[] = [
    {
      title: "Business Settings",
      items: [
        {
          icon: "time-outline",
          iconColor: colors.primary,
          label: "Business Hours",
          value: "8:00 AM - 6:00 PM",
          showChevron: true,
          onPress: () => handleComingSoon("Business Hours configuration"),
        },
        {
          icon: "calendar-outline",
          iconColor: colors.primary,
          label: "Working Days",
          value: "Mon - Sat",
          showChevron: true,
          onPress: () => handleComingSoon("Working Days selection"),
        },
        {
          icon: "hourglass-outline",
          iconColor: colors.primary,
          label: "Default Appointment Duration",
          value: "60 minutes",
          showChevron: true,
          onPress: () => handleComingSoon("Duration settings"),
        },
        {
          icon: "pricetag-outline",
          iconColor: colors.primary,
          label: "Pricing Templates",
          value: "3 templates",
          showChevron: true,
          onPress: () => handleComingSoon("Pricing templates"),
        },
        {
          icon: "timer-outline",
          iconColor: colors.primary,
          label: "Time Slot Intervals",
          value: "30 minutes",
          showChevron: true,
          onPress: () => handleComingSoon("Time slot configuration"),
        },
        {
          icon: "pause-circle-outline",
          iconColor: colors.primary,
          label: "Buffer Time Between Appointments",
          value: "15 minutes",
          showChevron: true,
          onPress: () => handleComingSoon("Buffer time settings"),
        },
      ],
    },
    {
      title: "Calendar Settings",
      items: [
        {
          icon: "close-circle-outline",
          iconColor: colors.error,
          label: "Holidays & Blackout Dates",
          value: "2 dates set",
          showChevron: true,
          onPress: () => handleComingSoon("Holidays configuration"),
        },
        {
          icon: "calendar-number-outline",
          iconColor: colors.secondary,
          label: "First Day of Week",
          value: "Sunday",
          showChevron: true,
          onPress: () => handleComingSoon("Week start day selection"),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "notifications-outline",
          iconColor: colors.accent,
          label: "Appointment Reminders",
          showSwitch: true,
          switchValue: appointmentReminders,
          onSwitchChange: setAppointmentReminders,
        },
        {
          icon: "alarm-outline",
          iconColor: colors.accent,
          label: "Reminder Timing",
          value: "24 hours before",
          showChevron: true,
          onPress: () => handleComingSoon("Reminder timing configuration"),
        },
        {
          icon: "card-outline",
          iconColor: colors.accent,
          label: "Payment Reminders",
          showSwitch: true,
          switchValue: paymentReminders,
          onSwitchChange: setPaymentReminders,
        },
        {
          icon: "warning-outline",
          iconColor: colors.warning,
          label: "Conflict Alerts",
          showSwitch: true,
          switchValue: conflictAlerts,
          onSwitchChange: setConflictAlerts,
        },
      ],
    },
    {
      title: "Display Preferences",
      items: [
        {
          icon: "moon-outline",
          iconColor: colors.text,
          label: "Dark Mode",
          showSwitch: true,
          switchValue: darkMode,
          onSwitchChange: (value) => {
            setDarkMode(value);
            handleComingSoon("Dark mode theme");
          },
        },
        {
          icon: "calendar-outline",
          iconColor: colors.secondary,
          label: "Date Format",
          value: "MM/DD/YYYY",
          showChevron: true,
          onPress: () => handleComingSoon("Date format selection"),
        },
        {
          icon: "cash-outline",
          iconColor: colors.success,
          label: "Currency Display",
          value: "USD ($)",
          showChevron: true,
          onPress: () => handleComingSoon("Currency selection"),
        },
      ],
    },
    {
      title: "User Account",
      items: [
        {
          icon: "person-outline",
          iconColor: colors.primary,
          label: "Profile Information",
          showChevron: true,
          onPress: () => handleComingSoon("Profile editor"),
        },
        {
          icon: "business-outline",
          iconColor: colors.primary,
          label: "Business Details",
          value: "Casandra's Grooming",
          showChevron: true,
          onPress: () => handleComingSoon("Business details editor"),
        },
        {
          icon: "lock-closed-outline",
          iconColor: colors.error,
          label: "Change Password",
          showChevron: true,
          onPress: () => handleComingSoon("Password change"),
        },
        {
          icon: "finger-print-outline",
          iconColor: colors.accent,
          label: "Biometric Authentication",
          showSwitch: true,
          switchValue: biometricAuth,
          onSwitchChange: (value) => {
            setBiometricAuth(value);
            handleComingSoon("Biometric authentication");
          },
        },
        {
          icon: "exit-outline",
          iconColor: colors.secondary,
          label: "Auto-Logout After",
          value: "30 minutes",
          showChevron: true,
          onPress: () => handleComingSoon("Auto-logout timing"),
        },
      ],
    },
    {
      title: "Data Management",
      items: [
        {
          icon: "cloud-upload-outline",
          iconColor: colors.primary,
          label: "Automatic Backup",
          showSwitch: true,
          switchValue: autoBackup,
          onSwitchChange: setAutoBackup,
        },
        {
          icon: "cloud-done-outline",
          iconColor: colors.success,
          label: "Last Backup",
          value: "2 hours ago",
          showChevron: true,
          onPress: () => handleComingSoon("Backup details"),
        },
        {
          icon: "download-outline",
          iconColor: colors.secondary,
          label: "Export Data to CSV",
          showChevron: true,
          onPress: () => handleComingSoon("Data export"),
        },
        {
          icon: "trash-outline",
          iconColor: colors.error,
          label: "Clear Cache",
          showChevron: true,
          onPress: () => {
            Alert.alert(
              "Clear Cache",
              "Are you sure you want to clear the app cache? This will not delete your data.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () => Alert.alert("Success", "Cache cleared successfully"),
                },
              ]
            );
          },
        },
        {
          icon: "time-outline",
          iconColor: colors.textSecondary,
          label: "Data Retention Period",
          value: "2 years",
          showChevron: true,
          onPress: () => handleComingSoon("Retention period configuration"),
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: "information-circle-outline",
          iconColor: colors.primary,
          label: "App Version",
          value: "1.0.0",
        },
        {
          icon: "document-text-outline",
          iconColor: colors.secondary,
          label: "Terms of Service",
          showChevron: true,
          onPress: () => handleComingSoon("Terms of Service"),
        },
        {
          icon: "shield-checkmark-outline",
          iconColor: colors.success,
          label: "Privacy Policy",
          showChevron: true,
          onPress: () => handleComingSoon("Privacy Policy"),
        },
        {
          icon: "help-circle-outline",
          iconColor: colors.accent,
          label: "Help & Support",
          showChevron: true,
          onPress: () => handleComingSoon("Help center"),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="settings" size={32} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your app preferences</Text>
      </View>

      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex === section.items.length - 1 && styles.settingItemLast,
                ]}
                onPress={item.onPress}
                disabled={!item.onPress && !item.showSwitch}
                activeOpacity={item.onPress ? 0.7 : 1}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor || colors.primary}15` }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor || colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                </View>
                {item.showSwitch && item.onSwitchChange && (
                  <Switch
                    value={item.switchValue}
                    onValueChange={item.onSwitchChange}
                    trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                    thumbColor={item.switchValue ? colors.primary : colors.surface}
                  />
                )}
                {item.showChevron && (
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    padding: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.base,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
