import { Stack } from "expo-router";
import { FavoriteProvider } from "../src/context/FavoriteContext";

export default function RootLayout() {
  return (
    <FavoriteProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </FavoriteProvider>
  );
}
