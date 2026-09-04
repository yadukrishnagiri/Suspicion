import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  avatarUrl?: string;
}

interface AppState {
  isInitialized: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setInitialized: (value: boolean) => void;
  loginWithGoogle: (mockUser?: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  user: null,
  isAuthenticated: false,
  setInitialized: (value) => set({ isInitialized: value }),
  loginWithGoogle: (mockUser) =>
    set({
      isAuthenticated: true,
      user: {
        id: mockUser?.id || 'usr_google_01',
        name: mockUser?.name || 'Agent Alex',
        email: mockUser?.email || 'alex.operative@gmail.com',
        isGuest: false,
        avatarUrl: mockUser?.avatarUrl,
      },
    }),
  loginAsGuest: () =>
    set({
      isAuthenticated: true,
      user: {
        id: `guest_${Date.now().toString().slice(-4)}`,
        name: 'Guest Operative',
        isGuest: true,
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
