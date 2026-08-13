import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
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

/**
 * Format raw technical Firebase errors into friendly user messages
 */
function formatFirebaseError(error: any): string {
  if (!error) return "An unexpected authentication error occurred. Please try again.";
  const code = error?.code || "";
  const msg = String(error?.message || "");

  if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
    return "Domain 'cyber-lab-roan.vercel.app' needs to be added under Firebase Console -> Authentication -> Settings -> Authorized Domains.";
  }

  if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
    return "Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
  }

  if (
    code === "auth/account-exists-with-different-credential" ||
    msg.includes("account-exists-with-different-credential")
  ) {
    return "An account with this email address already exists. Please sign in with your password or use Google 1-Click.";
  }

  if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
    return "An account with this email address already exists. Please sign in instead.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    msg.includes("invalid-credential") ||
    msg.includes("user-not-found") ||
    msg.includes("wrong-password")
  ) {
    return "No account found with this email address, or incorrect password. Please register below or click 'Continue with Google'.";
  }

  if (code === "auth/weak-password" || msg.includes("weak-password")) {
    return "Password is too weak. Please enter at least 6 characters.";
  }

  if (code === "auth/invalid-email" || msg.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }

  if (code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
    return "Sign-in popup was closed before completing authentication.";
  }

  if (code === "auth/network-request-failed" || msg.includes("network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }

  return "Authentication error. Please check your credentials or click 'Continue with Google'.";
}

// 1. Google 1-Click Sign-In & Registration
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Google Auth Error:", error);
    const code = error?.code || "";
    const msg = String(error?.message || "");

    if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
      return {
        user: null,
        error: "Domain 'cyber-lab-roan.vercel.app' is not authorized in Firebase Console. Please add 'cyber-lab-roan.vercel.app' under Firebase Auth Settings -> Authorized Domains.",
      };
    }

    if (
      code === "auth/account-exists-with-different-credential" ||
      msg.includes("account-exists-with-different-credential")
    ) {
      return {
        user: null,
        error: "An account with this email address already exists via password. Please sign in using your Email & Password below.",
      };
    }

    return { user: null, error: formatFirebaseError(error) };
  }
}

// 2. Email & Password Sign-In (With Smart Missing Account Detection)
export async function loginWithEmail(email: string, pass: string) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Email Auth Error:", error);
    const code = error?.code || "";
    const msg = String(error?.message || "");

    try {
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
      if (methods.includes("google.com") && !methods.includes("password")) {
        return {
          user: null,
          error: "An account with this email address already exists via Google 1-Click. Please click 'Continue with Google' above to sign in.",
        };
      }
      if (methods.length === 0) {
        return {
          user: null,
          error: "No account found with this email address. Please click 'Register Here' below to create a free account.",
        };
      }
    } catch {
      // Ignore provider check if blocked
    }

    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || msg.includes("invalid-credential")) {
      return {
        user: null,
        error: "No account found with this email address, or incorrect password. Please click 'Register Here' below to create a free account.",
      };
    }

    return { user: null, error: formatFirebaseError(error) };
  }
}

// 3. Email & Password Registration (With Existing Email Detection)
export async function registerWithEmail(email: string, pass: string) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Registration Error:", error);
    const code = error?.code || "";
    const msg = String(error?.message || "");

    if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
      return {
        user: null,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    return { user: null, error: formatFirebaseError(error) };
  }
}

// 4. Sign Out
export async function logoutFirebase() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: formatFirebaseError(error) };
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
