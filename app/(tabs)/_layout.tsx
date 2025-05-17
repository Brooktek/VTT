// app/(tabs)/_layout.tsx
"use client";

import { Stack, useNavigation } from "expo-router"; // Combined imports
// import { Ionicons } from "@expo/vector-icons"; // Removed unused import
import { useTheme } from "@/contexts/ThemeContext";
import CustomHeader from "@/components/CustomHeader";

export default function StackLayout() {
  const { colors } = useTheme();
  const navigation = useNavigation(); // useNavigation is used

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.accent, 
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="explore" 
        options={{
          title: "Analytics",
          headerShown: false, 
        }}
      />
    </Stack>
  );
}
