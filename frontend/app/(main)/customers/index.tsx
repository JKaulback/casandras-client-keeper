import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from "../../../styles/theme";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  occupation?: string;
  address?: string;
}

export default function CustomersIndex() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: Replace with your actual API endpoint
  const API_URL = "http://localhost:5000/api/customers";

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when backend is ready
      // const response = await fetch(API_URL);
      // const data = await response.json();
      // setCustomers(data);
      // setFilteredCustomers(data);
      
      // Mock data for now
      const mockData: Customer[] = [
        { _id: "1", name: "Sarah Johnson", phone: "(555) 123-4567", email: "sarah@email.com", occupation: "Teacher" },
        { _id: "2", name: "Mike Williams", phone: "(555) 234-5678", email: "mike@email.com", occupation: "Engineer" },
        { _id: "3", name: "Emily Davis", phone: "(555) 345-6789", email: "emily@email.com", occupation: "Designer" },
      ];
      setCustomers(mockData);
      setFilteredCustomers(mockData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.occupation?.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => router.push(`/customers/${item._id}` as any)}
    >
      <View style={styles.customerIconContainer}>
        <Ionicons name="person" size={iconSizes.base} color={colors.primary} />
      </View>
      
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerDetail}>
          <Ionicons name="call" size={14} color={colors.textSecondary} /> {item.phone}
        </Text>
        {item.email && (
          <Text style={styles.customerDetail}>
            <Ionicons name="mail" size={14} color={colors.textSecondary} /> {item.email}
          </Text>
        )}
        {item.occupation && (
          <Text style={styles.customerDetail}>
            <Ionicons name="briefcase" size={14} color={colors.textSecondary} /> {item.occupation}
          </Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={iconSizes.base} color={colors.textLight} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyStateText}>
        {searchQuery ? "No customers found" : "No customers yet"}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? "Try a different search term" : "Add your first customer to get started"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Customer Count */}
      <View style={styles.headerRow}>
        <Text style={styles.countText}>
          {filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/customers/new" as any)}
        >
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
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
  listContainer: {
    padding: spacing.base,
    paddingTop: 0,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  customerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  customerDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
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
