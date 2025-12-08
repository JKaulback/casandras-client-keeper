/**
 * Appointment Date Time Picker Component
 * Provides an optimized date/time selection UI for appointments with:
 * - Dropdown date selection (month/day/year)
 * - Availability view showing available time slots
 * - Conflict detection with existing appointments
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../styles/theme";

interface AppointmentDateTimePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  existingAppointments?: { dateTime: string; durationMinutes: number }[];
}

export function AppointmentDateTimePicker({
  label,
  value,
  onValueChange,
  error,
  required = false,
  existingAppointments = [],
}: AppointmentDateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [showingAvailabilities, setShowingAvailabilities] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const formatDisplayValue = (dateString: string) => {
    if (!dateString) return "Select date and time";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate years (current year + next 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => ({
    label: String(currentYear + i),
    value: String(currentYear + i),
  }));

  // Months
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // Generate days based on selected month/year
  const getDaysInMonth = () => {
    if (!selectedYear || !selectedMonth) return [];
    const daysCount = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => {
      const dayNumber = i + 1;
      const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, dayNumber);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        label: `${weekday}, ${dayNumber}`,
        value: String(dayNumber).padStart(2, "0"),
      };
    });
  };

  // Generate time slots (8 AM to 6 PM in 30-minute intervals)
  const generateTimeSlots = (dateStr: string) => {
    const slots: string[] = [];
    // Parse date string (YYYY-MM-DD) and create date in local timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    const now = new Date();
    
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 18 && minute === 30) break; // Stop at 6:00 PM
        
        // Create slot time in local timezone
        const slotTime = new Date(year, month - 1, day, hour, minute, 0, 0);
        
        // Skip past times
        if (slotTime <= now) continue;
        
        // Check if slot is available (no conflict with existing appointments)
        const isAvailable = !existingAppointments.some(apt => {
          const aptStart = new Date(apt.dateTime);
          const aptEnd = new Date(aptStart.getTime() + apt.durationMinutes * 60000);
          const slotEnd = new Date(slotTime.getTime() + 60 * 60000); // Assume 1 hour duration
          
          return (slotTime >= aptStart && slotTime < aptEnd) || 
                 (slotEnd > aptStart && slotEnd <= aptEnd) ||
                 (slotTime <= aptStart && slotEnd >= aptEnd);
        });
        
        if (isAvailable) {
          const hours = slotTime.getHours();
          const minutes = slotTime.getMinutes();
          const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
          const displayTime = slotTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          
          slots.push(`${timeStr}|${displayTime}`);
        }
      }
    }
    
    return slots;
  };

  const handleViewAvailabilities = () => {
    if (!selectedYear || !selectedMonth || !selectedDay) return;
    
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    const slots = generateTimeSlots(dateStr);
    setAvailableSlots(slots);
    setShowingAvailabilities(true);
    
    // Auto-select first available slot
    if (slots.length > 0) {
      const [timeValue] = slots[0].split('|');
      const dateTimeValue = `${dateStr}T${timeValue}`;
      onValueChange(dateTimeValue);
    }
  };

  const handleTimeSelect = (slot: string) => {
    const [timeValue] = slot.split('|');
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    const dateTimeValue = `${dateStr}T${timeValue}`;
    onValueChange(dateTimeValue);
    setShowPicker(false);
    setShowingAvailabilities(false);
  };

  const handleOpenPicker = () => {
    // Initialize with current date if nothing selected
    if (!selectedYear) {
      const today = new Date();
      setSelectedYear(String(today.getFullYear()));
      setSelectedMonth(String(today.getMonth() + 1).padStart(2, "0"));
      setSelectedDay(String(today.getDate()).padStart(2, "0"));
    }
    setShowPicker(true);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.pickerContainer, error && styles.inputError]}
        onPress={handleOpenPicker}
      >
        <Ionicons name="calendar" size={20} color={colors.textSecondary} style={styles.icon} />
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {formatDisplayValue(value)}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowPicker(false);
          setShowingAvailabilities(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showingAvailabilities ? "Select Time" : "Select Date"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPicker(false);
                  setShowingAvailabilities(false);
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {!showingAvailabilities ? (
              <View style={styles.dateSelectionContainer}>
                <View style={styles.dropdownRow}>
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownLabel}>Month</Text>
                    <TouchableOpacity 
                      style={styles.dropdownPicker}
                      onPress={() => setShowMonthPicker(true)}
                    >
                      <Text style={[styles.dropdownText, !selectedMonth && styles.dropdownPlaceholder]}>
                        {selectedMonth ? months.find(m => m.value === selectedMonth)?.label : "Month"}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownLabel}>Day</Text>
                    <TouchableOpacity 
                      style={[styles.dropdownPicker, !selectedMonth && styles.dropdownDisabled]}
                      onPress={() => selectedMonth && setShowDayPicker(true)}
                      disabled={!selectedMonth}
                    >
                      <Text style={[styles.dropdownText, !selectedDay && styles.dropdownPlaceholder]}>
                        {selectedDay ? selectedDay : "Day"}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownLabel}>Year</Text>
                    <TouchableOpacity 
                      style={styles.dropdownPicker}
                      onPress={() => setShowYearPicker(true)}
                    >
                      <Text style={[styles.dropdownText, !selectedYear && styles.dropdownPlaceholder]}>
                        {selectedYear || "Year"}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.viewAvailabilitiesButton,
                    (!selectedYear || !selectedMonth || !selectedDay) && styles.buttonDisabled
                  ]}
                  onPress={handleViewAvailabilities}
                  disabled={!selectedYear || !selectedMonth || !selectedDay}
                >
                  <Ionicons name="time-outline" size={20} color={colors.surface} />
                  <Text style={styles.viewAvailabilitiesButtonText}>
                    View Availabilities
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.timeSlotsContainer}>
                {availableSlots.length === 0 ? (
                  <View style={styles.noSlotsContainer}>
                    <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
                    <Text style={styles.noSlotsText}>
                      No available time slots for this date
                    </Text>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setShowingAvailabilities(false)}
                    >
                      <Text style={styles.backButtonText}>Choose Another Date</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.slotsHeader}>
                      <Text style={styles.slotsHeaderText}>
                        Available slots for {selectedMonth}/{selectedDay}/{selectedYear}
                      </Text>
                      <TouchableOpacity onPress={() => setShowingAvailabilities(false)}>
                        <Text style={styles.changeDate}>Change Date</Text>
                      </TouchableOpacity>
                    </View>
                    {availableSlots.map((slot, index) => {
                      const [timeValue, displayTime] = slot.split('|');
                      const isSelected = value === `${selectedYear}-${selectedMonth}-${selectedDay}T${timeValue}`;
                      
                      return (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.timeSlot,
                            isSelected && styles.timeSlotSelected,
                            index === 0 && styles.timeSlotFirst
                          ]}
                          onPress={() => handleTimeSelect(slot)}
                        >
                          <Ionicons 
                            name="time" 
                            size={20} 
                            color={isSelected ? colors.primary : colors.textSecondary} 
                          />
                          <Text style={[
                            styles.timeSlotText,
                            isSelected && styles.timeSlotTextSelected
                          ]}>
                            {displayTime}
                          </Text>
                          {index === 0 && (
                            <View style={styles.nextAvailableBadge}>
                              <Text style={styles.nextAvailableText}>Next Available</Text>
                            </View>
                          )}
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <Pressable style={styles.subModalOverlay} onPress={() => setShowMonthPicker(false)}>
          <View style={styles.subModalContent}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.subModalScroll}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.value}
                  style={styles.subModalOption}
                  onPress={() => {
                    setSelectedMonth(month.value);
                    setSelectedDay(""); // Reset day when month changes
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.subModalOptionText}>{month.label}</Text>
                  {selectedMonth === month.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Day Picker Modal */}
      <Modal
        visible={showDayPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <Pressable style={styles.subModalOverlay} onPress={() => setShowDayPicker(false)}>
          <View style={styles.subModalContent}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Select Day</Text>
              <TouchableOpacity onPress={() => setShowDayPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.subModalScroll}>
              {getDaysInMonth().map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={styles.subModalOption}
                  onPress={() => {
                    setSelectedDay(day.value);
                    setShowDayPicker(false);
                  }}
                >
                  <Text style={styles.subModalOptionText}>{day.label}</Text>
                  {selectedDay === day.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <Pressable style={styles.subModalOverlay} onPress={() => setShowYearPicker(false)}>
          <View style={styles.subModalContent}>
            <View style={styles.subModalHeader}>
              <Text style={styles.subModalTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.subModalScroll}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year.value}
                  style={styles.subModalOption}
                  onPress={() => {
                    setSelectedYear(year.value);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.subModalOptionText}>{year.label}</Text>
                  {selectedYear === year.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  pickerText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  icon: {
    marginRight: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: "80%",
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  dateSelectionContainer: {
    padding: spacing.lg,
  },
  dropdownRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dropdown: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dropdownPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  dropdownText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  viewAvailabilitiesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  viewAvailabilitiesButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  timeSlotsContainer: {
    maxHeight: 400,
  },
  slotsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  slotsHeaderText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  changeDate: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  timeSlotFirst: {
    backgroundColor: `${colors.primary}10`,
  },
  timeSlotSelected: {
    backgroundColor: `${colors.primary}20`,
  },
  timeSlotText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  timeSlotTextSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  nextAvailableBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  nextAvailableText: {
    color: colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  noSlotsContainer: {
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  noSlotsText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  backButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  subModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  subModalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: "60%",
    ...shadows.large,
  },
  subModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subModalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subModalScroll: {
    maxHeight: 300,
  },
  subModalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subModalOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
});
