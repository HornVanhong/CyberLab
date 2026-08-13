"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  LogIn,
  UserPlus,
  Play,
  LogOut,
  Menu,
  X,
  Sparkles,
  Layers,
  Wrench,
  Globe,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LandingNavbarProps {
  onOpenAuth: (tab: "login" | "register") => void;
}

export function LandingNavbar({ onOpenAuth }: LandingNavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProtectedNav = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      onOpenAuth("login");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-base font-extrabold tracking-tight text-white">
              <span>Cyber</span>
              <span className="text-emerald-400">Lab</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                v1.0
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase -mt-0.5">
              PRACTICE PLATFORM
            </p>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-300">
          <Link
            href="/labs"
            onClick={(e) => handleProtectedNav(e, "/labs")}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Practice Labs</span>
          </Link>

          <Link
            href="/tools"
            onClick={(e) => handleProtectedNav(e, "/tools")}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tool Academy</span>
          </Link>

          <Link
            href="/osint-resources"
            onClick={(e) => handleProtectedNav(e, "/osint-resources")}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>OSINT Directory</span>
          </Link>

          <Link
            href="/exam"
            onClick={(e) => handleProtectedNav(e, "/exam")}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Exam</span>
          </Link>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[120px] truncate text-slate-200">{user.email || "Operator"}</span>
              </div>

              <Link
                href="/labs"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter Practice Labs</span>
              </Link>

              <button
                onClick={() => logout()}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Sign In Button */}
              <button
                onClick={() => onOpenAuth("login")}
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => onOpenAuth("register")}
                type="button"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg md:hidden hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs animate-fadeIn">
          <Link
            href="/labs"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNav(e, "/labs");
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Practice Labs</span>
          </Link>
          <Link
            href="/tools"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNav(e, "/tools");
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
          >
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>Learn Tools Academy</span>
          </Link>
          <Link
            href="/osint-resources"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNav(e, "/osint-resources");
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>OSINT Directory</span>
          </Link>
          <Link
            href="/exam"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleProtectedNav(e, "/exam");
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Certification Exam</span>
          </Link>

          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("login");
                }}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-slate-200 font-bold border border-slate-800 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("register");
                }}
                className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
