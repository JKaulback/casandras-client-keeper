/**
 * Theme Configuration
 * Centralized styling constants for the app
 */

// Color Palette
export const colors = {
  // Primary Colors (Lavender Theme)
  primary: '#8B7BC7',        // Rich Lavender
  primaryLight: '#F0EDFC',   // Very Light Lavender
  primaryDark: '#6B5BA7',    // Deeper Lavender
  
  // Secondary Colors (Complementary)
  secondary: '#C9927C',      // Warm Rose/Peach
  secondaryLight: '#FCF0ED', // Light Rose
  
  // Accent Colors
  accent: '#6BB896',         // Rich Mint/Green
  accentLight: '#EDFCF5',    // Very Light Mint
  purple: '#A87BC7',         // Medium Purple
  
  // Neutral Colors
  background: '#FAF9FC',     // Subtle Lavender Tint
  surface: '#FFFFFF',
  text: '#2D2440',           // Deep Purple (Higher Contrast)
  textSecondary: '#6B6178',  // Medium Purple-Gray
  textLight: '#9B92A8',      // Light Purple-Gray
  border: '#E8E5F0',         // Lavender-Tinted Border
  
  // Semantic Colors
  success: '#6BB896',
  warning: '#E8AA5E',
  error: '#D97676',
  info: '#8B7BC7',
  
  // Shadow
  shadow: '#000000',
};

// Spacing Scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Typography
export const typography = {
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border Radius
export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadows (iOS & Android compatible)
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Icon Sizes
export const iconSizes = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 28,
  lg: 32,
  xl: 40,
  xxl: 48,
};

// Common Layout Values
export const layout = {
  containerPadding: spacing.lg,
  cardPadding: spacing.base,
  sectionSpacing: spacing.xxl,
  itemSpacing: spacing.md,
};

// Responsive Breakpoints
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Responsive utility to check if screen is mobile-sized
export const isMobileWidth = (width: number) => width < breakpoints.tablet;
export const isTabletWidth = (width: number) => width >= breakpoints.tablet && width < breakpoints.desktop;
export const isDesktopWidth = (width: number) => width >= breakpoints.desktop;

