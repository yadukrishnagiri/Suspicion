import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { subscribeToAuthChanges } from "@/services/authService";

export function useAppInitialization() {
  const { isInitialized, setInitialized, setUser } = useAppStore();

  useEffect(() => {
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
