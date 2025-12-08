import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";

export default function MainLayout() {
  const router = useRouter();

  const handleHomePress = () => {
    router.dismissAll();
    router.replace("/");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginRight: 8 }}>
            <TouchableOpacity onPress={handleSettingsPress}>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHomePress}>
              <Ionicons name="home" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Stack.Screen 
        name="customers/index" 
        options={{ 
          title: "Customers",
        }} 
      />
      <Stack.Screen 
        name="customers/[id]" 
        options={{ 
          title: "Customer Details",
        }} 
      />
      <Stack.Screen 
        name="customers/new" 
        options={{ 
          title: "New Customer",
        }} 
      />
      <Stack.Screen 
        name="dogs/index" 
        options={{ 
          title: "Dogs",
        }} 
      />
      <Stack.Screen 
        name="dogs/[id]" 
        options={{ 
          title: "Dog Details",
        }} 
      />
      <Stack.Screen 
        name="dogs/new" 
        options={{ 
          title: "New Dog",
        }} 
      />
      <Stack.Screen 
        name="appointments/index" 
        options={{ 
          title: "Appointments",
        }} 
      />
      <Stack.Screen 
        name="appointments/[id]" 
        options={{ 
          title: "Appointment Details",
        }} 
      />
      <Stack.Screen 
        name="appointments/new" 
        options={{ 
          title: "New Appointment",
        }} 
      />
    </Stack>
  );
}
