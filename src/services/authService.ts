import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db, googleProvider } from './firebase';
import { UserProfile } from '@/store/useAppStore';

export interface UserStats {
  gamesPlayed: number;
  citizenWins: number;
  imposterWins: number;
  timesImposter: number;
}

export interface FirestoreUserData {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: string;
  stats: UserStats;
}

/**
 * Sync or create user record in Cloud Firestore with absolute crash-safety
 */
export async function syncUserToFirestore(fbUser: FirebaseUser): Promise<UserProfile> {
  const fallbackProfile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || 'Agent ' + fbUser.uid.slice(0, 5),
    email: fbUser.email || undefined,
    photoURL: fbUser.photoURL || undefined,
    isGuest: false,
    stats: {
      gamesPlayed: 0,
      citizenWins: 0,
      imposterWins: 0,
      timesImposter: 0,
    },
  };

  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const now = new Date().toISOString();

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreUserData;
      const userStats = data.stats || fallbackProfile.stats;
      
      // Update last active asynchronously in background
      updateDoc(userDocRef, { lastLoginAt: now }).catch((e) => {
        console.warn('[Firestore updateDoc ignored error]', e);
      });

      return {
        ...fallbackProfile,
        stats: userStats,
      };
    } else {
      // Create initial profile in Firestore
      const newUserData: FirestoreUserData = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || fallbackProfile.name,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        createdAt: now,
        lastLoginAt: now,
        stats: fallbackProfile.stats!,
      };

      setDoc(userDocRef, newUserData).catch((e) => {
        console.warn('[Firestore setDoc ignored error]', e);
      });

      return fallbackProfile;
    }
  } catch (err) {
    console.warn('[Firestore Sync Fallback] Using local profile data:', err);
    return fallbackProfile;
  }
}

/**
 * Google Sign In handler for web and native platforms
 */
export async function signInWithGoogleService(): Promise<UserProfile> {
  if (Platform.OS === 'web') {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return await syncUserToFirestore(userCredential.user);
  } else {
    // Native Google Sign in flow
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
    
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Perform sign in
    const signInResult = await GoogleSignin.signIn();
    
    // Support multiple SDK return formats
    const idToken = (signInResult as any)?.data?.idToken || (signInResult as any)?.idToken;

    if (!idToken) {
      throw new Error('No ID token obtained from Google Sign-In.');
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return await syncUserToFirestore(userCredential.user);
  }
}

/**
 * Sign out current user
 */
export async function signOutService(): Promise<void> {
  try {
    if (Platform.OS !== 'web') {
      try {
        await GoogleSignin.signOut();
      } catch {
        // Ignore native sign out error
      }
    }
    await signOut(auth);
  } catch (err) {
    console.warn('[SignOut Error]', err);
  }
}

/**
 * Auth state listener with complete unhandled rejection protection
 */
export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (fbUser) => {
    try {
      if (fbUser) {
        const profile = await syncUserToFirestore(fbUser);
        callback(profile);
      } else {
        callback(null);
      }
    } catch (err) {
      console.warn('[Auth State Change Exception]', err);
      if (fbUser) {
        callback({
          id: fbUser.uid,
          name: fbUser.displayName || 'Agent ' + fbUser.uid.slice(0, 5),
          email: fbUser.email || undefined,
          photoURL: fbUser.photoURL || undefined,
          isGuest: false,
          stats: {
            gamesPlayed: 0,
            citizenWins: 0,
            imposterWins: 0,
            timesImposter: 0,
          },
        });
      } else {
        callback(null);
      }
    }
  });
}
