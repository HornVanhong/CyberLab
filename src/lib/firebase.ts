import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

// Your official Firebase App Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDZKZN6zBbIhCWJ8DN2WJ1RloEGFAtFUMU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cyberlap-7e5d3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cyberlap-7e5d3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cyberlap-7e5d3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "882129241031",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:882129241031:web:88f1345012ab04f99e8fe2",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-N1YD75E1YP",
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 1. Google 1-Click Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Google Auth Error:", error);
    return { user: null, error: error?.message || "Google sign-in failed" };
  }
}

// 2. Email & Password Sign-In
export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Email Auth Error:", error);
    return { user: null, error: error?.message || "Invalid credentials" };
  }
}

// 3. Email & Password Registration
export async function registerWithEmail(email: string, pass: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Registration Error:", error);
    return { user: null, error: error?.message || "Registration failed" };
  }
}

// 4. Sign Out
export async function logoutFirebase() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error?.message || "Logout failed" };
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
