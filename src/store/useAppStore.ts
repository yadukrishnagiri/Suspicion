import { create } from "zustand";

export interface UserStats {
  gamesPlayed: number;
  citizenWins: number;
  imposterWins: number;
  timesImposter: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  photoURL?: string;
  stats?: UserStats;
}

interface AppState {
  isInitialized: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setInitialized: (value: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  loginWithGoogle: (profile?: UserProfile) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  user: null,
  isAuthenticated: false,
  setInitialized: (value) => set({ isInitialized: value }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  loginWithGoogle: (profile) =>
    set({
      isAuthenticated: true,
      user: profile || {
        id: 'usr_google_01',
        name: 'Agent Alex',
        email: 'alex.operative@gmail.com',
        isGuest: false,
        stats: {
          gamesPlayed: 0,
          citizenWins: 0,
          imposterWins: 0,
          timesImposter: 0,
        },
      },
    }),
  loginAsGuest: () =>
    set({
      isAuthenticated: true,
      user: {
        id: `guest_${Date.now().toString().slice(-4)}`,
        name: 'Guest Operative',
        isGuest: true,
        stats: {
          gamesPlayed: 0,
          citizenWins: 0,
          imposterWins: 0,
          timesImposter: 0,
        },
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
