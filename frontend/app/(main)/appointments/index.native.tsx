/**
 * Appointments List Screen - Mobile Version
 * Calendar view showing appointments by day with time slots
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { colors, spacing } from "../../../styles/theme";
import { LoadingState } from "../../../components/StateComponents";
import {
  DateNavigator,
  CalendarActions,
  TimeSlot,
} from "../../../components/AppointmentComponents";

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

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

  const getAppointmentsForDay = () => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return isSameDay(appointmentDate, selectedDate);
    });
  };

  const getAppointmentsForTimeSlot = (hour: number) => {
    const dayAppointments = getAppointmentsForDay();
    return dayAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);
      return appointmentDate.getHours() === hour;
    });
  };

  const businessHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  if (loading) {
    return <LoadingState message="Loading appointments..." />;
  }

  const dayAppointments = getAppointmentsForDay();

  return (
    <View style={styles.container}>
      <DateNavigator
        selectedDate={selectedDate}
        appointmentCount={dayAppointments.length}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
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
            appointments={getAppointmentsForTimeSlot(hour)}
            onAppointmentPress={handleAppointmentPress}
          />
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
});
