"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { CyberLabProvider } from "@/context/CyberLabContext";
import { AuthProvider } from "@/context/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <CyberLabProvider>
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
    </CyberLabProvider>
    </AuthProvider>
  );
}
