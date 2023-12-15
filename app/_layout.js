import { Slot } from "expo-router";
import { SessionProvider } from "../context/Ctx";
import { StateProvider } from "../store";

export default function Layout() {
  return (
    <StateProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </StateProvider>
  );
}
