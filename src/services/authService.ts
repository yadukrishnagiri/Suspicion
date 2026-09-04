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
 * Sync or create user record in Cloud Firestore
 */
export async function syncUserToFirestore(fbUser: FirebaseUser): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  const now = new Date().toISOString();

  let userStats: UserStats = {
    gamesPlayed: 0,
    citizenWins: 0,
    imposterWins: 0,
    timesImposter: 0,
  };

  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreUserData;
      userStats = data.stats || userStats;
      // Update last active
      await updateDoc(userDocRef, {
        lastLoginAt: now,
      });
    } else {
      // Create initial profile in Firestore
      const newUserData: FirestoreUserData = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'Agent ' + fbUser.uid.slice(0, 5),
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        createdAt: now,
        lastLoginAt: now,
        stats: userStats,
      };
      await setDoc(userDocRef, newUserData);
    }
  } catch (err) {
    console.warn('[Firestore Sync] Could not sync user document:', err);
  }

  return {
    id: fbUser.uid,
    name: fbUser.displayName || 'Agent ' + fbUser.uid.slice(0, 5),
    email: fbUser.email || undefined,
    photoURL: fbUser.photoURL || undefined,
    isGuest: false,
    stats: userStats,
  };
}

/**
 * Google Sign In handler
 */
export async function signInWithGoogleService(idToken?: string): Promise<UserProfile> {
  if (Platform.OS === 'web') {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return await syncUserToFirestore(userCredential.user);
  } else {
    // Native flow: exchange ID token from AuthSession with Firebase credential
    if (!idToken) {
      throw new Error('Google ID Token required on mobile platforms');
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
  await signOut(auth);
}

/**
 * Auth state listener
 */
export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await syncUserToFirestore(fbUser);
      callback(profile);
    } else {
      callback(null);
    }
  });
}
