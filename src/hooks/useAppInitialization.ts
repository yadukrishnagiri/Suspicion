import { useEffect } from "react";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAppStore } from "@/store/useAppStore";
import { subscribeToAuthChanges } from "@/services/authService";

export function useAppInitialization() {
  const { isInitialized, setInitialized, setUser } = useAppStore();

  useEffect(() => {
    // Configure Google Sign-In once at startup (not inside the sign-in button handler)
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId:
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
          "505307234648-k846gsl50mnnvlcsk0d3ov9jmbegkbb7.apps.googleusercontent.com",
        offlineAccess: false,
      });
    }

    // Listen for Firebase auth state changes (restores session automatically)
    const unsubscribe = subscribeToAuthChanges((profile) => {
      if (profile) {
        setUser(profile);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setInitialized, setUser]);

  return { isInitialized };
}