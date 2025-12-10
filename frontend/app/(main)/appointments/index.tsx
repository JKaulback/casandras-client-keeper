/**
 * Appointments Screen - Responsive Entry Point
 * Automatically switches between mobile and desktop views based on screen width
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Alert, useWindowDimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { colors, spacing } from "../../../styles/theme";
import { LoadingState } from "../../../components/StateComponents";
import { MonthCalendarModal } from "../../../components/MonthCalendarModal";
import { 
  WeeklyView, 
  DateNavigator, 
  CalendarActions, 
  TimeSlot,
  WeekNavigator,
  DesktopActions,
  CalendarHeader,
  TimeGrid
} from "../../../components/AppointmentComponents";

// Breakpoint for mobile vs desktop (768px is standard tablet breakpoint)
const MOBILE_BREAKPOINT = 768;

export default function AppointmentsScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStart(new Date()));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Determine if we should show mobile or desktop view
  const isMobile = Platform.OS !== 'web' || width < MOBILE_BREAKPOINT;

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

  // Mobile view handlers
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
  };

  // Desktop view handlers
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

  // Shared handlers
  const handleOpenMonthModal = () => {
    setShowMonthModal(true);
  };

  const handleCloseMonthModal = () => {
    setShowMonthModal(false);
  };

  const handleMonthDateSelect = (date: Date) => {
    if (isMobile) {
      setSelectedDate(date);
    } else {
      setSelectedWeekStart(getWeekStart(date));
    }
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

  // Mobile view helpers
  const getAppointmentsForDay = () => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  const getAppointmentsForTimeSlotMobile = (hour: number) => {
    const dayAppointments = getAppointmentsForDay();
    return dayAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return appointmentDate.getHours() === hour;
    });
  };

  // Desktop view helpers
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(selectedWeekStart);
      day.setDate(selectedWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const businessHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  if (loading) {
    return <LoadingState message="Loading appointments..." />;
  }

  // Mobile View
  if (isMobile) {
    const dayAppointments = getAppointmentsForDay();

    return (
      <View style={styles.container}>
        <WeeklyView
          appointments={appointments}
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
        />

        <DateNavigator
          selectedDate={selectedDate}
          appointmentCount={dayAppointments.length}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onDatePress={handleOpenMonthModal}
        />

        <CalendarActions onToday={handleToday} onAddAppointment={handleAddPress} />

        <ScrollView
          style={styles.scheduleContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >
          {businessHours.map((hour) => (
            <TimeSlot
              key={hour}
              hour={hour}
              appointments={getAppointmentsForTimeSlotMobile(hour)}
              onAppointmentPress={handleAppointmentPress}
            />
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <MonthCalendarModal
          visible={showMonthModal}
          onClose={handleCloseMonthModal}
          appointments={appointments}
          selectedDate={selectedDate}
          onDateSelect={handleMonthDateSelect}
        />
      </View>
    );
  }

  // Desktop View
  const weekDays = getWeekDays();

  return (
    <View style={styles.containerDesktop}>
      <View style={styles.header}>
        <WeekNavigator
          selectedWeekStart={selectedWeekStart}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onWeekClick={handleOpenMonthModal}
        />

        <DesktopActions
          onThisWeek={handleThisWeek}
          onAddAppointment={handleAddPress}
        />
      </View>

      <CalendarHeader weekDays={weekDays} />

      <TimeGrid
        weekDays={weekDays}
        businessHours={businessHours}
        appointments={appointments}
        onAppointmentPress={handleAppointmentPress}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <MonthCalendarModal
        visible={showMonthModal}
        onClose={handleCloseMonthModal}
        appointments={appointments}
        selectedDate={selectedWeekStart}
        onDateSelect={handleMonthDateSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scheduleContainer: {
    flex: 1,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
  // Desktop styles
  containerDesktop: {
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
});
