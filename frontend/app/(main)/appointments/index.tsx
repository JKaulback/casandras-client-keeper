/**
 * Appointments Screen - Responsive Entry Point
 * Automatically switches between mobile and desktop views based on screen width
 */

import React from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import AppointmentsScreenMobile from './index.native';
import AppointmentsScreenWeb from './index.web';

// Breakpoint for mobile vs desktop (768px is standard tablet breakpoint)
const MOBILE_BREAKPOINT = 768;

export default function AppointmentsScreen() {
  const { width } = useWindowDimensions();
  
  // On native platforms, always use mobile view
  if (Platform.OS !== 'web') {
    return <AppointmentsScreenMobile />;
  }
  
  // On web, switch based on screen width
  const isMobile = width < MOBILE_BREAKPOINT;
  
  return isMobile ? <AppointmentsScreenMobile /> : <AppointmentsScreenWeb />;
}
