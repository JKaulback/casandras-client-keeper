/**
 * Appointment Calendar Components
 * Reusable components for appointment schedule views
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../styles/theme";
import { Appointment } from "../services/appointmentService";

// Weekly View Component
interface WeeklyViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDayPress: (date: Date) => void;
}

export function WeeklyView({ appointments, selectedDate, onDayPress }: WeeklyViewProps) {
  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Generate array of 7 days starting from Sunday
  const weekStart = getWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  // Count appointments for a specific day
  const getAppointmentCount = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    }).length;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  return (
    <View style={weeklyStyles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={weeklyStyles.scrollContent}>
        {weekDays.map((day, index) => {
          const count = getAppointmentCount(day);
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                weeklyStyles.dayCard,
                selected && weeklyStyles.dayCardSelected,
                today && !selected && weeklyStyles.dayCardToday,
              ]}
              onPress={() => onDayPress(day)}
            >
              <Text style={[weeklyStyles.dayName, selected && weeklyStyles.dayNameSelected]}>
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </Text>
              <Text style={[weeklyStyles.dayNumber, selected && weeklyStyles.dayNumberSelected]}>
                {day.getDate()}
              </Text>
              <View style={[weeklyStyles.countBadge, count === 0 && weeklyStyles.countBadgeEmpty]}>
                <Text style={[weeklyStyles.countText, count === 0 && weeklyStyles.countTextEmpty]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const weeklyStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  dayCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    minWidth: 70,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayCardToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  dayName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  dayNameSelected: {
    color: colors.surface,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  dayNumberSelected: {
    color: colors.surface,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
  },
  countBadgeEmpty: {
    backgroundColor: colors.border,
  },
  countText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "bold",
  },
  countTextEmpty: {
    color: colors.textSecondary,
  },
});

// Date Navigator Component
interface DateNavigatorProps {
  selectedDate: Date;
  appointmentCount: number;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onDatePress?: () => void;
}

export function DateNavigator({
  selectedDate,
  appointmentCount,
  onPreviousDay,
  onNextDay,
  onDatePress,
}: DateNavigatorProps) {
  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, tomorrow)) {
      return "Tomorrow";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.dateNavigator}>
      <TouchableOpacity onPress={onPreviousDay} style={styles.navButton}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onDatePress} 
        style={styles.dateInfo}
        disabled={!onDatePress}
      >
        <Text style={styles.dateText}>{formatDateHeader(selectedDate)}</Text>
        <Text style={styles.appointmentCount}>
          {appointmentCount} {appointmentCount === 1 ? "appointment" : "appointments"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNextDay} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

// Calendar Action Buttons Component
interface CalendarActionsProps {
  onToday: () => void;
  onAddAppointment: () => void;
}

export function CalendarActions({ onToday, onAddAppointment }: CalendarActionsProps) {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity onPress={onToday} style={styles.todayButton}>
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddAppointment} style={styles.addButton}>
        <Ionicons name="add" size={20} color={colors.surface} />
        <Text style={styles.addButtonText}>New Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

// Time Slot Component
interface TimeSlotProps {
  hour: number;
  appointments: Appointment[];
  onAppointmentPress: (id: string) => void;
}

export function TimeSlot({ hour, appointments, onAppointmentPress }: TimeSlotProps) {
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <View style={styles.timeSlot}>
      <View style={styles.timeLabel}>
        <Text style={styles.timeText}>{formatTime(hour)}</Text>
      </View>
      <View style={styles.appointmentArea}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onPress={() => onAppointmentPress(appointment._id)}
            />
          ))
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptySlotText}>Available</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
}

export function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "completed":
        return colors.accent;
      case "cancelled":
        return colors.error;
      default:
        return colors.warning;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.appointmentCard, { borderLeftColor: getStatusColor(appointment.status) }]}
      onPress={onPress}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentStatus}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Text>
        <Text style={styles.appointmentCost}>${appointment.cost.toFixed(2)}</Text>
      </View>
      <Text style={styles.appointmentDuration}>{appointment.durationMinutes} minutes</Text>
      {appointment.notes && (
        <Text style={styles.appointmentNotes} numberOfLines={2}>
          {appointment.notes}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Date Navigator Styles
  dateNavigator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navButton: {
    padding: spacing.sm,
  },
  dateInfo: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  appointmentCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  todayButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  todayButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },

  // Time Slot Styles
  timeSlot: {
    flexDirection: "row",
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeLabel: {
    width: 80,
    padding: spacing.md,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  appointmentArea: {
    flex: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  emptySlot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlotText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    fontStyle: "italic",
  },

  // Appointment Card Styles
  appointmentCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  appointmentStatus: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  appointmentCost: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  appointmentDuration: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  appointmentNotes: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});
