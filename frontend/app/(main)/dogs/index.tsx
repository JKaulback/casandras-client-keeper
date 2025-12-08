/**
 * Dogs List Screen
 * View and search all dogs
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { dogService, Dog } from "../../../services/dogService";
import { colors, spacing } from "../../../styles/theme";
import {
  SearchBar,
  ListHeader,
  ListItemCard,
  EmptyState,
} from "../../../components/ListComponents";
import { LoadingState } from "../../../components/StateComponents";

export default function DogsScreen() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDogs = async () => {
    try {
      const data = await dogService.getAll();
      setDogs(data);
      setFilteredDogs(data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      Alert.alert("Error", "Failed to load dogs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDogs();
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
    router.push("/dogs/new");
  };

  const handleDogPress = (id: string) => {
    router.push(`/dogs/${id}`);
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
      <SearchBar
        placeholder="Search dogs by name, breed, or color..."
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
      />

      <ListHeader
        count={filteredDogs.length}
        itemName="Dog"
        buttonLabel="Add Dog"
        buttonIcon="add"
        onAddPress={handleAddPress}
      />

      <FlatList
        data={filteredDogs}
        renderItem={renderDogItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <EmptyState
            icon="paw"
            title="No dogs found"
            subtitle={searchQuery ? "Try adjusting your search" : "Add your first dog to get started"}
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
});
