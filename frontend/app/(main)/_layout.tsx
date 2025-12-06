import { Stack } from "expo-router";
import { colors } from "../../styles/theme";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
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
