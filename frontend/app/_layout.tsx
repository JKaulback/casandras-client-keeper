import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="(auth)/sign-in" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="(auth)/callback" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Scissors and Sudz",
          headerStyle: {
            backgroundColor: '#FAF9FC',
          },
          headerTintColor: '#2D2440',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/settings")} style={{ marginRight: 8 }}>
              <Ionicons name="settings-outline" size={24} color="#7C3AED" />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerStyle: {
            backgroundColor: '#FAF9FC',
          },
          headerTintColor: '#2D2440',
        }} 
      />
      <Stack.Screen 
        name="(main)" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
