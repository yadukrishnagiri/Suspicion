import "../global.css";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-css-interop";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

if (Platform.OS === "web") {
  try {
    (StyleSheet as any).setFlag?.("darkMode", "class");
  } catch (e) {
    // Flag already set or noop
  }
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
