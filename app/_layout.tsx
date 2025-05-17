// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext'; // Your theme provider
// ... other necessary imports like SplashScreen, useFonts ...

import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add your font imports here, e.g.:
    // 'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  if (!loaded) return null; // Or your splash screen

  return (
    <CustomThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" /> {/* Explicitly declare if needed, though convention usually suffices */}
      </Stack>
    </CustomThemeProvider>
  );
}