/**
 * Customer's Dogs List Screen
 * View all dogs belonging to a specific customer
 */

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text } from "react-native";
import { useLocalSearchParams, useRouter, Stack, useNavigation } from "expo-router";
import { dogService, Dog } from "../../../../services/dogService";
import { customerService, Customer } from "../../../../services/customerService";
import { colors, spacing, typography } from "../../../../styles/theme";
import {
  SearchBar,
  ListHeader,
  ListItemCard,
  EmptyState,
} from "../../../../components/ListComponents";
import { LoadingState } from "../../../../components/StateComponents";

export default function CustomerDogsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Set initial navigation title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Dogs",
    });
  }, [navigation]);

  // Update navigation title when customer data loads
  useLayoutEffect(() => {
    if (customer) {
      navigation.setOptions({
        title: `${customer.name}'s Dogs`,
      });
    }
  }, [customer, navigation]);

  const fetchCustomerAndDogs = async () => {
    try {
      const [customerData, dogsData] = await Promise.all([
        customerService.getById(id as string),
        dogService.getByOwnerId(id as string),
      ]);
      setCustomer(customerData);
      setDogs(dogsData);
      setFilteredDogs(dogsData);
    } catch (error) {
      console.error("Error fetching customer dogs:", error);
      Alert.alert("Error", "Failed to load customer's dogs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomerAndDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCustomerAndDogs();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDogs(dogs);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = dogs.filter(
      (dog) =>
        dog.name.toLowerCase().includes(lowercaseQuery) ||
        dog.breed?.toLowerCase().includes(lowercaseQuery) ||
        dog.color?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredDogs(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredDogs(dogs);
  };

  const handleAddPress = () => {
    router.push(`/dogs/new?ownerId=${id}`);
  };

  const handleDogPress = (dogId: string) => {
    router.push(`/dogs/${dogId}`);
  };

  const renderDogItem = ({ item }: { item: Dog }) => {
    const details = [];
    
    if (item.breed) {
      details.push({ icon: "paw" as const, text: item.breed });
    }
    
    if (item.color) {
      details.push({ icon: "color-palette" as const, text: item.color });
    }
    
    if (item.sex && item.sex !== "unknown") {
      const sexLabel = item.sex === "male" ? "Male" : "Female";
      details.push({ icon: "information-circle" as const, text: sexLabel });
    }

    return (
      <ListItemCard
        icon="paw"
        iconColor={colors.secondary}
        iconBackgroundColor={colors.secondaryLight}
        title={item.name}
        details={details}
        onPress={() => handleDogPress(item._id)}
      />
    );
  };

  if (loading) {
    return <LoadingState message="Loading dogs..." />;
  }

  return (
    <View style={styles.container}>
      {customer && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{customer.name}&apos;s Dogs</Text>
          <Text style={styles.headerSubtitle}>
            {dogs.length} {dogs.length === 1 ? "dog" : "dogs"}
          </Text>
        </View>
      )}

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search dogs..."
      />

      <ListHeader
        count={filteredDogs.length}
        itemName="Dog"
        buttonLabel="Add Dog"
        onAddPress={handleAddPress}
      />

      <FlatList
        data={filteredDogs}
        renderItem={renderDogItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="paw"
            title={searchQuery ? "No dogs found" : "No dogs yet"}
            subtitle={
              searchQuery
                ? "Try adjusting your search"
                : `Add ${customer?.name}&apos;s first dog to get started`
            }
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
  header: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
