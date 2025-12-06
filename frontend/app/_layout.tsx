import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Scissors and Sudz",
          headerStyle: {
            backgroundColor: '#FAF9FC',
          },
          headerTintColor: '#2D2440',
        }} 
      />
    </Stack>
  );
}
