"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { LandingNavbar } from "./LandingNavbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { CyberLabProvider } from "@/context/CyberLabContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth modal state for landing page
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  // Check if current route is a public standalone page
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Redirect unauthenticated users away from protected routes BEFORE rendering Sidebar/Navbar
  useEffect(() => {
    if (!loading && !user && !isLandingPage && !isAuthPage) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }
      router.replace("/login");
    }
  }, [user, loading, isLandingPage, isAuthPage, pathname, router]);

  // 1. PUBLIC LANDING PAGE (Full Width, No App Sidebar)
  if (isLandingPage) {
    return (
      <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-grid">
        {/* Background ambient glow circles */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Clean Landing Top Header */}
        <LandingNavbar onOpenAuth={handleOpenAuth} />

        {/* Auth Modal Triggerable from Top Header */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
        />

        {/* Main Landing Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Educational Disclaimer Footer */}
        <footer className="px-6 py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-400 font-mono">
          <p>
            🔒 <span className="text-slate-400">CyberLab Practice Platform</span> • Intended exclusively for educational cybersecurity training in isolated local lab environments (e.g. Kali & Metasploitable).
          </p>
        </footer>
      </div>
    );
  }

  // 2. PUBLIC STANDALONE AUTH PAGES (/login, /register)
  if (isAuthPage) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center bg-slate-950 text-slate-100 cyber-grid p-4">
        {/* Background ambient glow circles */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <main className="w-full max-w-5xl mx-auto">{children}</main>
      </div>
    );
  }

  // 3. PROTECTED LAB ROUTES: If loading auth status, show minimal loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-mono text-xs text-slate-400">
        <div className="relative mb-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Shield className="w-4 h-4 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="animate-pulse">Verifying Operator Credentials...</p>
      </div>
    );
  }

  // 4. PROTECTED LAB ROUTES: If NOT signed in, DO NOT render Sidebar or Navbar!
  if (!user) {
    return null;
  }

  // 5. PROTECTED LAB ROUTES: Authenticated Operator Dashboard Shell (With Sidebar & Navbar)
  return (
    <div className="relative min-h-screen flex bg-slate-950 text-slate-100 cyber-grid">
      {/* Background ambient glow circles */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Educational Disclaimer Footer */}
        <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950/60 text-center text-xs text-slate-400 font-mono">
          <p>
            🔒 <span className="text-slate-400">CyberLab Practice Platform</span> • Intended exclusively for educational cybersecurity training in isolated local lab environments (e.g. Kali & Metasploitable).
          </p>
        </footer>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CyberLabProvider>
        <AppShellContent>{children}</AppShellContent>
      </CyberLabProvider>
    </AuthProvider>
  );
}
