/**
 * Reusable List Components
 * For customers, dogs, appointments, etc.
 */

import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from "../styles/theme";

// Search Bar Component
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export function SearchBar({ placeholder, value, onChangeText, onClear }: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// List Header Component (count + add button)
interface ListHeaderProps {
  count: number;
  itemName: string;
  buttonLabel: string;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
  onAddPress: () => void;
}

export function ListHeader({ count, itemName, buttonLabel, buttonIcon = "add", onAddPress }: ListHeaderProps) {
  const pluralName = count === 1 ? itemName : `${itemName}s`;
  
  return (
    <View style={styles.headerRow}>
      <Text style={styles.countText}>
        {count} {pluralName}
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name={buttonIcon} size={20} color={colors.surface} />
        <Text style={styles.addButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

// List Item Card Component
interface ListItemCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackgroundColor: string;
  title: string;
  details: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
  onPress: () => void;
}

export function ListItemCard({ 
  icon, 
  iconColor, 
  iconBackgroundColor, 
  title, 
  details, 
  onPress 
}: ListItemCardProps) {
  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <View style={[styles.itemIconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={icon} size={iconSizes.base} color={iconColor} />
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{title}</Text>
        {details.map((detail, index) => (
          <Text key={index} style={styles.itemDetail}>
            <Ionicons name={detail.icon} size={14} color={colors.textSecondary} /> {detail.text}
          </Text>
        ))}
      </View>

      <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
    </TouchableOpacity>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={64} color={colors.textLight} />
      <Text style={styles.emptyStateText}>{title}</Text>
      <Text style={styles.emptyStateSubtext}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    margin: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },

  // List Header Styles
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  countText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.base,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // List Item Card Styles
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Empty State Styles
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl * 2,
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.base,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
