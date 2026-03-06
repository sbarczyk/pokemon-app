import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="pokemon/[id]"
        options={{
          presentation: "transparentModal",
          headerShown: false,
          contentStyle: {
              backgroundColor: "transparent"
          },
          animation: "slide_from_bottom",
          animationDuration: 300,
        }}
        />
    </Stack>
  );
}
