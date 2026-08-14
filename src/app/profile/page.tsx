"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  User,
  Mail,
  Award,
  Sparkles,
  Layers,
  Flag,
  Target,
  Clock,
  CheckCircle2,
  Calendar,
  Key,
  Edit2,
  Check,
  Download,
  Share2,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCyberLab } from "@/context/CyberLabContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const { stats, progress, getTargetIp, setTargetIp } = useCyberLab();

  const [isEditingIp, setIsEditingIp] = useState(false);
  const [ipInput, setIpInput] = useState(getTargetIp());
  const [savedNotice, setSavedNotice] = useState("");

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetIp(progress.currentLabId, ipInput);
    setIsEditingIp(false);
    setSavedNotice("Target IP updated successfully!");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  // Determine Operator Rank based on XP
  const getRank = (xp: number) => {
    if (xp >= 1500) return { title: "Cyber Commander", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", badge: "👑 RANK I" };
    if (xp >= 800) return { title: "Penetration Tester", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", badge: "🛡️ RANK II" };
    if (xp >= 300) return { title: "Cyber Specialist", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30", badge: "⚡ RANK III" };
    return { title: "Junior Operator", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", badge: "🟢 RECRUIT" };
  };

  const rank = getRank(stats.totalScore);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner / Operator Header */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Glow ambient circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-xl shadow-emerald-500/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                  <User className="w-10 h-10" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                ✓
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {user?.displayName || user?.email?.split("@")[0] || "Cyber Operator"}
                </h1>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${rank.bg} ${rank.color}`}>
                  {rank.badge} • {rank.title}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user?.email || "Operator Account"}</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cloud Synced</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action XP Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-right self-stretch md:self-auto flex flex-col justify-center">
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Total Score
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-center gap-2 justify-end">
              <Sparkles className="w-6 h-6" />
              <span>{stats.totalScore} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CHALLENGES SOLVED</span>
            <Flag className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {stats.completedChallenges} / {stats.totalChallenges}
          </p>
          <p className="text-[11px] text-emerald-400 font-mono font-semibold">
            {stats.progressPercentage}% Completed
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ACTIVE LAB</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-400 font-mono truncate">
            {progress.currentLabId === "metasploitable-2" ? "Metasploitable 2" : progress.currentLabId}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Local Practice Subnet</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TARGET IP</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-400 font-mono">
            {getTargetIp()}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Host-only network</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CERTIFICATIONS</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400 font-mono">
            {stats.totalScore >= 300 ? "1 Badge" : "0 Badges"}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Verified Credentials</p>
        </div>
      </div>

      {/* Account Details & Target IP Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Details (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>Operator Profile Information</span>
            </h3>
          </div>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{savedNotice}</span>
            </div>
          )}

          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Display Name</span>
                <span className="text-white font-bold text-sm">
                  {user?.displayName || user?.email?.split("@")[0] || "Operator"}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
                Profile ID
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Registered Email</span>
                <span className="text-cyan-300 font-bold text-sm">{user?.email || "Not Provided"}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                ✓ Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Unique Operator UID</span>
                <code className="text-slate-300 text-xs">{user?.uid || "Local Session"}</code>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
                System UID
              </span>
            </div>

            {/* Configure Target IP Form */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Target VM IP Address</span>
                  <span className="text-amber-400 font-bold text-sm">{getTargetIp()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingIp(!isEditingIp)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-mono text-xs border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingIp ? "Cancel" : "Change IP"}</span>
                </button>
              </div>

              {isEditingIp && (
                <form onSubmit={handleSaveIp} className="flex items-center gap-2 pt-2 border-t border-slate-900">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="e.g. 192.168.56.101"
                    required
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Badges (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Earned Badges & Certs</span>
            </h3>
          </div>

          <div className="space-y-4 font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-white">Metasploitable II Specialist</h4>
                <p className="text-[11px] text-slate-400">Captured initial access & enumeration flags</p>
                <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                  ✓ Verified Operator Badge
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-white">Linux CLI Scholar</h4>
                <p className="text-[11px] text-slate-400">Mastered Nmap, Hydra, Gobuster & SQLmap</p>
                <span className="text-[10px] text-cyan-400 font-bold block pt-1">
                  ✓ Interactive CLI Unlocked
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/exam"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 block text-center"
              >
                <Award className="w-4 h-4" />
                <span>Take Practical Exam for Official Certificate</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
