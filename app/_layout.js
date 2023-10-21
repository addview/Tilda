import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: "#974EC3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: true,
        presentation: "fullScreenModal",
      }}
    >
      {/* Optionally configure static options outside the route. */}
      <Stack.Screen name="index" options={{ title: "Registrering" }} />
    </Stack>
  );
}
