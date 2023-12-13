import { Stack, Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useSession } from "../../context/Ctx";
import SpinnerLoading from "../../components/SpinnerLoading";

export default function Layout() {
  const [user, setUser] = useState(null);
  const { session, signOut, isLoading } = useSession();

  useEffect(() => {}, [session]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#974EC3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
        presentation: "fullScreenModal",
      }}
    >
      {/* Optionally configure static options outside the route. */}
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
