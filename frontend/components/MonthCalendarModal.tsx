/**
 * Month Calendar Modal Component
 * Shows a full month view with appointment counts
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../styles/theme";
import { Appointment } from "../services/appointmentService";

interface MonthCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  appointments: Appointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MonthCalendarModal({
  visible,
  onClose,
  appointments,
  selectedDate,
  onDateSelect,
}: MonthCalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  // Reset currentMonth to selectedDate when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [visible, selectedDate]);

  // Get appointment count for a specific date
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

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of month and its day of week
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      return {
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
      };
    });

    // Current month's days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      isCurrentMonth: true,
    }));

    // Next month's leading days to fill the grid
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays; // 6 rows x 7 days
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
      date: new Date(year, month + 1, i + 1),
      isCurrentMonth: false,
    }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDatePress = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Text>

            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Week day headers */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const count = day.isCurrentMonth ? getAppointmentCount(day.date) : 0;
                const selected = isSameDay(day.date, selectedDate);
                const today = isToday(day.date);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      selected && styles.dayCellSelected,
                      today && !selected && styles.dayCellToday,
                    ]}
                    onPress={() => handleDatePress(day.date)}
                    disabled={!day.isCurrentMonth}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        !day.isCurrentMonth && styles.dayNumberOtherMonth,
                        selected && styles.dayNumberSelected,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>
                    {day.isCurrentMonth && count > 0 && (
                      <View style={[styles.badge, selected && styles.badgeSelected]}>
                        <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    height: 500,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.xl,
  },
  navButton: {
    padding: spacing.sm,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    padding: spacing.sm,
    zIndex: 1,
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: spacing.lg,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  dayNumberOtherMonth: {
    color: colors.textSecondary,
    opacity: 0.3,
  },
  dayNumberSelected: {
    color: colors.surface,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeSelected: {
    backgroundColor: colors.surface,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeTextSelected: {
    color: colors.primary,
  },
});
