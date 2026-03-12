import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { FavoriteProvider } from '../src/context/FavoriteContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { useTheme } from '../src/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutContent() {
  const { isDark, colors } = useTheme();
  return (
    <>
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <FavoriteProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: true,
                title: 'Settings',
                headerBackTitle: 'Back',
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.text,
                headerTitleStyle: { color: colors.text },
              }}
            />
              <Stack.Screen
                name="pokemon/[id]"
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade',
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              />
          </Stack>
        </BottomSheetModalProvider>
      </FavoriteProvider>
    </SafeAreaProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
