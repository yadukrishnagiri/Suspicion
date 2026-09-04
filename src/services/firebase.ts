import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  GoogleAuthProvider,
  Auth,
} from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDu6aw3hd4gixWk2raESuuShqkS4Y4kwLM",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "suspicion-a4a3a.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "suspicion-a4a3a",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "suspicion-a4a3a.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "505307234648",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:505307234648:web:5d8795392418b395e9652d",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E5E379SPC7"
};

// Initialize or reuse existing Firebase app
export const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Auth with cross-platform persistence
let authInstance: Auth;

if (Platform.OS === 'web') {
  authInstance = getAuth(app);
} else {
  try {
    const getRNPersistence = (FirebaseAuth as any).getReactNativePersistence;
    authInstance = initializeAuth(app, {
      persistence: getRNPersistence ? getRNPersistence(AsyncStorage) : undefined,
    });
  } catch {
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Standard scopes for user profile and identity
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
