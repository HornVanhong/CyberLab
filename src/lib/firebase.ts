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

  if (
    code === "auth/account-exists-with-different-credential" ||
    msg.includes("account-exists-with-different-credential")
  ) {
    return "An account with this email already exists under a different sign-in method. Please sign in with your email or Google.";
  }

  if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    msg.includes("invalid-credential") ||
    msg.includes("user-not-found") ||
    msg.includes("wrong-password")
  ) {
    return "Invalid email address or password. If you created your account with Google, please click 'Continue with Google'.";
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

  return "Sign in failed. Please check your credentials or sign in with Google.";
}

// 1. Google 1-Click Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Google Auth Error:", error);
    const code = error?.code || "";
    const msg = String(error?.message || "");

    if (
      code === "auth/account-exists-with-different-credential" ||
      msg.includes("account-exists-with-different-credential")
    ) {
      return {
        user: null,
        error: "An account with this email was created using Email & Password. Please sign in using your Email and Password below.",
      };
    }

    return { user: null, error: formatFirebaseError(error) };
  }
}

// 2. Email & Password Sign-In (With Smart Provider & Missing Account Inspection)
export async function loginWithEmail(email: string, pass: string) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Email Auth Error:", error);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
      if (methods.includes("google.com") && !methods.includes("password")) {
        return {
          user: null,
          error: "This account was created with Google 1-Click. Please click 'Continue with Google' above to sign in.",
        };
      }
      if (methods.length === 0) {
        return {
          user: null,
          error: "No account found with this email address. Click 'Register Here' below to create a free account.",
        };
      }
    } catch {
      // Ignore provider check if blocked
    }

    return {
      user: null,
      error: "Incorrect password or credentials. If you registered via Google, please click 'Continue with Google'.",
    };
  }
}

// 3. Email & Password Registration (With Smart Login Link Handler)
export async function registerWithEmail(email: string, pass: string) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Firebase Registration Error:", error);

    // If account already exists with password, attempt automatic sign-in
    if (error?.code === "auth/email-already-in-use") {
      try {
        const loginResult = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        return { user: loginResult.user, error: null };
      } catch (loginError: any) {
        // If login failed because account was created via Google
        if (loginError?.code === "auth/invalid-credential" || loginError?.code === "auth/wrong-password") {
          return {
            user: null,
            error: "An account with this email is registered via Google 1-Click. Please click 'Continue with Google' to sign in.",
          };
        }
      }
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
