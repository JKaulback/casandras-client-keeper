/**
 * Appointments Screen - Web Version
 * Weekly calendar view optimized for desktop browsers
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { colors, spacing, typography } from "../../../styles/theme";
import { LoadingState } from "../../../components/StateComponents";
import { MonthCalendarModal } from "../../../components/MonthCalendarModal";
import { Ionicons } from "@expo/vector-icons";
import { AppointmentCard } from "../../../components/AppointmentComponents";

export default function AppointmentsScreenWeb() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStart(new Date()));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to Sunday
    return new Date(d.setDate(diff));
  }

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekStart(newDate);
  };

  const handleThisWeek = () => {
    setSelectedWeekStart(getWeekStart(new Date()));
  };

  const handleOpenMonthModal = () => {
    setShowMonthModal(true);
  };

  const handleCloseMonthModal = () => {
    setShowMonthModal(false);
  };

  const handleMonthDateSelect = (date: Date) => {
    setSelectedWeekStart(getWeekStart(date));
  };

  const handleAddPress = () => {
    router.push("/appointments/new");
  };

  const handleAppointmentPress = (id: string) => {
    router.push(`/appointments/${id}`);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(selectedWeekStart);
      day.setDate(selectedWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return isSameDay(appointmentDate, day);
    });
  };

  const getAppointmentsForTimeSlot = (day: Date, hour: number) => {
    const dayAppointments = getAppointmentsForDay(day);
    return dayAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return appointmentDate.getHours() === hour;
    });
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(selectedWeekStart);
    weekEnd.setDate(selectedWeekStart.getDate() + 6);
    
    const startMonth = selectedWeekStart.toLocaleDateString("en-US", { month: "short" });
    const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
    const year = selectedWeekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${selectedWeekStart.getDate()} - ${weekEnd.getDate()}, ${year}`;
    }
    return `${startMonth} ${selectedWeekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${year}`;
  };

  const formatDayHeader = (date: Date) => {
    const today = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = date.getDate();
    const isToday = isSameDay(date, today);
    
    return { dayName, dayNum, isToday };
  };

  const businessHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  const weekDays = getWeekDays();

  if (loading) {
    return <LoadingState message="Loading appointments..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.weekNavigator}>
          <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleOpenMonthModal}
            style={styles.weekInfo}
            activeOpacity={0.7}
          >
            <Text style={styles.weekText}>{formatWeekRange()}</Text>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} style={styles.calendarIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleThisWeek} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>This Week</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleAddPress} style={styles.addButton}>
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={styles.addButtonText}>New Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarHeader}>
        <View style={styles.timeColumn} />
        {weekDays.map((day, index) => {
          const { dayName, dayNum, isToday } = formatDayHeader(day);
          return (
            <View key={index} style={styles.dayHeader}>
              <Text style={[styles.dayName, isToday && styles.todayText]}>{dayName}</Text>
              <View style={[styles.dayNumContainer, isToday && styles.todayCircle]}>
                <Text style={[styles.dayNum, isToday && styles.todayNumText]}>{dayNum}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <ScrollView
        style={styles.calendarGrid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {businessHours.map((hour) => {
          const period = hour >= 12 ? "PM" : "AM";
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const timeLabel = `${displayHour} ${period}`;

          return (
            <View key={hour} style={styles.timeRow}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>{timeLabel}</Text>
              </View>
              {weekDays.map((day, dayIndex) => {
                const slotAppointments = getAppointmentsForTimeSlot(day, hour);
                return (
                  <View key={dayIndex} style={styles.timeSlot}>
                    {slotAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                        onPress={() => handleAppointmentPress(appointment._id)}
                      />
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <MonthCalendarModal
        visible={showMonthModal}
        onClose={handleCloseMonthModal}
        appointments={appointments}
        selectedDate={selectedWeekStart}
        onDateSelect={handleMonthDateSelect}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    maxWidth: 1400,
    marginHorizontal: "auto" as any,
    width: "100%",
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.lg,
  },
  weekNavigator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  weekInfo: {
    minWidth: 300,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  calendarIcon: {
    marginLeft: spacing.xs,
  },
  weekText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  todayButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  calendarHeader: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  timeColumn: {
    width: 80,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  dayName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  dayNumContainer: {
    marginTop: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    backgroundColor: colors.primary,
  },
  dayNum: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  todayText: {
    color: colors.primary,
  },
  todayNumText: {
    color: colors.surface,
  },
  calendarGrid: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeLabel: {
    width: 80,
    paddingTop: spacing.sm,
    paddingRight: spacing.sm,
    alignItems: "flex-end",
  },
  timeLabelText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  timeSlot: {
    flex: 1,
    padding: spacing.xs,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    gap: spacing.xs,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
