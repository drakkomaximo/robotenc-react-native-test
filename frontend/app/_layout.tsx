import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LeaderboardProvider } from "@/state/LeaderboardContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LeaderboardProvider>
        <Slot />
      </LeaderboardProvider>
    </SafeAreaProvider>
  );
}
