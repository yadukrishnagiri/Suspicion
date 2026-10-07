import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { STAGE } from "@/components/live/masqueradeTheme";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cormorant: require('@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf'),
    CormorantItalic: require('@expo-google-fonts/cormorant-garamond/500Medium_Italic/CormorantGaramond_500Medium_Italic.ttf'),
    DMSans: require('@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
    DMSansMedium: require('@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
    DMSansBold: require('@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf'),
  });
  if (fontError) return <View style={{ flex: 1, backgroundColor: STAGE.bg, justifyContent: 'center', padding: 24 }}><Text style={{ color: STAGE.text }}>The fonts couldn’t load. Please restart Suspicion.</Text></View>;
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: STAGE.bg }} />;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: STAGE.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: STAGE.bg },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
