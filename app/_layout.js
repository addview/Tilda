import { Stack, Redirect, Slot, SplashScreen } from "expo-router";
import { SessionProvider } from "../context/Ctx";

export default function Layout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
