"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Shield,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Key,
  Play,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, loginGoogle, loginEmail } = useAuth();
  const router = useRouter();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const openAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    await loginEmail("student@cyberlab.local", "student123");
    setIsDemoLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-mono text-xs">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Shield className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-400 animate-pulse">Initializing CyberLab Authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
        {/* Auth Modal Triggerable from guard */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
        />

        {/* Ambient background glow */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 space-y-8 text-center shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Lock Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>AUTHENTICATION REQUIRED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In to Unlock <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Practice Lab Environment
              </span>
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
              You must be signed in to access interactive practice labs, tool masterclasses, CTF challenges, OSINT search portals, and VM certification exams.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openAuth("login")}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuth("register")}
                className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Google 1-Click */}
            <button
              onClick={() => loginGoogle()}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>1-Click Sign In with Google</span>
            </button>

            {/* Quick Demo Student Account */}
            <button
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isDemoLoading ? "Logging in..." : "Try Demo Account (Fast Student Login)"}</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Or return to{" "}
            <Link href="/" className="text-cyan-400 hover:underline font-bold">
              Home Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
