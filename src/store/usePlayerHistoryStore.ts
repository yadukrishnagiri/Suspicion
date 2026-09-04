import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlayerHistoryState {
  recentNames: string[];
  addNames: (names: string[]) => void;
}

export const usePlayerHistoryStore = create<PlayerHistoryState>()(
  persist(
    (set, get) => ({
      recentNames: [],
      addNames: (names) => {
        const current = get().recentNames;
        // Filter out empty names and default "Player X" names
        const validNames = names
          .map((n) => n.trim())
          .filter((n) => n.length > 0 && !/^Player \d+$/i.test(n));

        // Add new names to the front, remove duplicates
        const updated = Array.from(new Set([...validNames, ...current])).slice(0, 20); // Keep last 20
        set({ recentNames: updated });
      },
    }),
    {
      name: 'suspicion-player-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
