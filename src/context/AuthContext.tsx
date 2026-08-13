"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutFirebase,
} from "@/lib/firebase";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginGoogle: () => Promise<{ user: FirebaseUser | null; error: string | null }>;
  loginEmail: (email: string, pass: string) => Promise<{ user: FirebaseUser | null; error: string | null }>;
  registerEmail: (email: string, pass: string) => Promise<{ user: FirebaseUser | null; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    return await signInWithGoogle();
  };

  const loginEmail = async (email: string, pass: string) => {
    return await loginWithEmail(email, pass);
  };

  const registerEmail = async (email: string, pass: string) => {
    return await registerWithEmail(email, pass);
  };

  const logout = async () => {
    return await logoutFirebase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginGoogle,
        loginEmail,
        registerEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
