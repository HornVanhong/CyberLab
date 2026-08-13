"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Edit2,
  Check,
  Shield,
  HelpCircle,
  User,
  LogIn,
  LogOut,
  Key,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { Modal } from "@/components/ui/Modal";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { progress, stats, getTargetIp, setTargetIp, updateSettings } = useCyberLab();
  const currentIp = getTargetIp();

  const [isEditIpOpen, setIsEditIpOpen] = useState(false);
  const [ipInput, setIpInput] = useState(currentIp);

  // Auth State
  const [authUser, setAuthUser] = useState<{ username: string; email: string; role: string; xp: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState("student@cyberlab.local");
  const [passwordInput, setPasswordInput] = useState("student123");
  const [usernameInput, setUsernameInput] = useState("student");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Check authenticated session on load
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setAuthUser(data.user);
      } else {
        setAuthUser(null);
      }
    } catch {
      setAuthUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);

    const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegisterMode
      ? { username: usernameInput, email: emailInput, password: passwordInput }
      : { email: emailInput, password: passwordInput };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed");
      } else {
        setAuthUser(data.user);
        setIsAuthModalOpen(false);
      }
    } catch {
      setAuthError("Network connection error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthUser(null);
    } catch {
      // logout fallback
    }
  };

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetIp(progress.currentLabId, ipInput);
    setIsEditIpOpen(false);
  };

  const toggleSound = () => {
    updateSettings({ soundEffects: !progress.settings.soundEffects });
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        {/* Left Section: Mobile Menu & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            type="button"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-200 rounded-lg lg:hidden hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">LAB ENVIRONMENT</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">{progress.currentLabId === "metasploitable-2" ? "Metasploitable 2" : progress.currentLabId}</span>
          </div>
        </div>

        {/* Right Section: Target IP, Auth, XP Pill, Sound Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Target IP Pill */}
          <button
            onClick={() => {
              setIpInput(currentIp);
              setIsEditIpOpen(true);
            }}
            type="button"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer group shadow-sm"
            title="Click to configure Target IP"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-spin" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden md:inline">Target:</span>
              <span className="font-semibold text-cyan-300">{currentIp}</span>
            </div>
            <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
          </button>

          {/* User Auth Profile Button */}
          {authUser ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">{authUser.username}</span>
                <span className="text-[10px] bg-cyan-950 px-1 py-0.2 rounded text-cyan-400 uppercase">{authUser.role}</span>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-mono text-emerald-400 transition-all cursor-pointer font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}

          {/* Total Score Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{stats.totalScore} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
            title={progress.settings.soundEffects ? "Mute audio effects" : "Enable audio effects"}
          >
            {progress.settings.soundEffects ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={isRegisterMode ? "Create CyberLab Account" : "User Authentication Login"}
        description={isRegisterMode ? "Register a new full-stack profile" : "Log into your account to sync XP and certificates"}
      >
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
              ⚠️ {authError}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">USERNAME</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">PASSWORD</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
            />
          </div>

          {!isRegisterMode && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <span className="font-bold text-cyan-400 block">Default Accounts:</span>
              <p>Student: <code className="text-emerald-400">student@cyberlab.local / student123</code></p>
              <p>Admin: <code className="text-amber-400">admin@cyberlab.local / admin123</code></p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              {isRegisterMode ? "Already have an account? Log in" : "Need an account? Register here"}
            </button>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              {isAuthLoading ? "Processing..." : isRegisterMode ? "Register Account" : "Log In"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Target IP Edit Modal */}
      <Modal
        isOpen={isEditIpOpen}
        onClose={() => setIsEditIpOpen(false)}
        title="Configure Target IP Address"
        description="Set the local IP address of your Metasploitable 2 or practice VM"
      >
        <form onSubmit={handleSaveIp} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              TARGET IP ADDRESS (VIRTUAL MACHINE)
            </label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.56.101"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              This IP will be displayed across challenge guides and instructions to match your local VM subnet.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditIpOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-colors"
            >
              Save Target IP
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
