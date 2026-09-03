import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useAppInitialization() {
  const { isInitialized, setInitialized } = useAppStore();

  useEffect(() => {
    setInitialized(true);
  }, [setInitialized]);

  return { isInitialized };
}
