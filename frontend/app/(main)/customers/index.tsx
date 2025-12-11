import { View, StyleSheet, FlatList, RefreshControl, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { colors, spacing } from "../../../styles/theme";
import { customerService, Customer } from "../../../services/customerService";
import { SearchBar, ListHeader, ListItemCard, EmptyState } from "../../../components/ListComponents";
import { LoadingState } from "../../../components/StateComponents";

export default function CustomersIndex() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const numColumns = isDesktop ? 2 : 1;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
      setFilteredCustomers(data);
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

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const details = [
      { icon: "call" as const, text: item.phone },
      ...(item.email ? [{ icon: "mail" as const, text: item.email }] : []),
      ...(item.occupation ? [{ icon: "briefcase" as const, text: item.occupation }] : []),
    ];

    return (
      <ListItemCard
        icon="person"
        iconColor={colors.primary}
        iconBackgroundColor={colors.primaryLight}
        title={item.name}
        details={details}
        onPress={() => router.push(`/customers/${item._id}` as any)}
      />
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="people-outline"
      title={searchQuery ? "No customers found" : "No customers yet"}
      subtitle={searchQuery ? "Try a different search term" : "Add your first customer to get started"}
    />
  );

  if (loading) {
    return <LoadingState message="Loading customers..." />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search customers..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <ListHeader
        count={filteredCustomers.length}
        itemName="customer"
        buttonLabel="Add Customer"
        onAddPress={() => router.push("/customers/new" as any)}
      />

      <FlatList
        key={numColumns}
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        columnWrapperStyle={isDesktop ? styles.gridRow : undefined}
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
  listContainer: {
    padding: spacing.base,
    paddingTop: 0,
  },
  gridRow: {
    gap: spacing.base,
    paddingHorizontal: spacing.base,
  },
});

