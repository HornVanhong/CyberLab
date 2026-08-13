"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Terminal,
  Globe,
  Award,
  Wrench,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Search,
  Zap,
  BookOpen,
  HelpCircle,
  BarChart3,
  Server,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export default function LandingHomePage() {
  const { stats } = useCyberLab();
  const { user, loginGoogle } = useAuth();
  
  const [activeTabCommand, setActiveTabCommand] = useState<string>("nmap");
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "register">("login");

  const openAuth = (tab: "login" | "register") => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const terminalDemos: Record<string, { cmd: string; output: string }> = {
    nmap: {
      cmd: "nmap -sC -sV 192.168.56.102",
      output:
        "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.102\nPORT     STATE SERVICE VERSION\n21/tcp   open  ftp     vsFTPd 2.3.4 (Backdoor VULNERABLE)\n22/tcp   open  ssh     OpenSSH 4.7p1\n80/tcp   open  http    Apache httpd 2.2.8\n445/tcp  open  netbios Samba smbd 3.0.20-debian\nNmap done: 1 IP address (1 host up) scanned in 2.14 seconds",
    },
    shodan: {
      cmd: "shodan search 'port:21 anonymous'",
      output:
        "Query: port:21 anonymous\nTotal results: 14,890\n\n198.51.100.42:21 - vsFTPd 2.3.4 (Anonymous Login Allowed)\n203.0.113.15:21   - ProFTPD 1.3.5\n[+] Results retrieved via Shodan OSINT Intelligence Engine",
    },
    crtsh: {
      cmd: "curl -s 'https://crt.sh/?q=%.target.com&output=json'",
      output:
        "[\n  { \"name_value\": \"target.com\" },\n  { \"name_value\": \"dev-staging.target.com\" },\n  { \"name_value\": \"mail.target.com\" }\n]\n[+] Passive SSL Certificate Transparency logs extracted",
    },
    hashcat: {
      cmd: "hashcat -m 0 5f4dcc3b5aa765d61d8327deb882cf99 rockyou.txt",
      output:
        "5f4dcc3b5aa765d61d8327deb882cf99:password\nSession..........: hashcat\nStatus...........: Cracked (+100 XP)",
    },
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-16">
      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />

      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Copy & CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-4 h-4" />
              <span>HANDS-ON CYBERSECURITY & OSINT PRACTICE PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Master Ethical Hacking & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                OSINT Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              Learn 25+ CLI security tools, query live OSINT search portals (<strong>Shodan</strong>, <strong>Censys</strong>, <strong>Crt.sh</strong>), solve Metasploitable CTF lab challenges, and pass the practical Kali Linux certification exam.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <>
                  <Link
                    href="/labs"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Enter Practice Labs</span>
                  </Link>

                  <Link
                    href="/osint-resources"
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Explore OSINT Portals</span>
                  </Link>

                  <Link
                    href="/exam"
                    className="px-6 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Take Exam</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("login")}
                    type="button"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => openAuth("register")}
                    type="button"
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    <span>Create Free Account / Sign Up</span>
                  </button>

                  <button
                    onClick={() => loginGoogle()}
                    type="button"
                    className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                    <span>1-Click Google Sign In</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <span className="text-xl font-bold text-white font-mono">{stats.totalChallenges}</span>
                <p className="text-[11px] text-slate-400 font-mono">CTF Challenges</p>
              </div>
              <div>
                <span className="text-xl font-bold text-emerald-400 font-mono">25+</span>
                <p className="text-[11px] text-slate-400 font-mono">Security Tools</p>
              </div>
              <div>
                <span className="text-xl font-bold text-cyan-400 font-mono">100%</span>
                <p className="text-[11px] text-slate-400 font-mono">Free & Open Source</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Preview Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Terminal Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["nmap", "shodan", "crtsh", "hashcat"].map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTabCommand(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTabCommand === key
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  ${key}
                </button>
              ))}
            </div>

            {/* Interactive Terminal Window */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-bold text-slate-300">cyberlab@kali:~#</span>
                </div>
                <span className="text-emerald-400 text-[10px]">LIVE PREVIEW</span>
              </div>

              <div className="text-emerald-300 font-bold">
                $ {terminalDemos[activeTabCommand].cmd}
              </div>

              <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-52 font-mono">
                {terminalDemos[activeTabCommand].output}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 6 CORE PLATFORM FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Everything You Need for <span className="text-emerald-400">Cyber Training</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Explore 6 comprehensive security modules designed for students, ethical hackers, and security analysts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Learn Tools Academy */}
          <Link
            href="/tools"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Learn Tools Academy
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Interactive 5-part lessons for 25+ tools (Nmap, Gobuster, SQLmap, Hydra, Wireshark, Metasploit, Ghidra, CyberChef). Includes flag builders and terminal simulators.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 pt-2">
              <span>Open Tool Academy</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: OSINT Web Links */}
          <Link
            href="/osint-resources"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-cyan-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                OSINT Web Links Directory
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Direct 1-click links to top web search engines (Shodan.io, Censys, Crt.sh, DNSDumpster, HaveIBeenPwned, Hunter.io, DomainTools WHOIS, GHDB) with copyable dorks.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 pt-2">
              <span>Visit OSINT Directory</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Practical OSINT & Kali Exam */}
          <Link
            href="/exam"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-amber-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Practical OSINT & Kali Exam
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Solve 6 practical exam tasks, execute Kali Linux VM commands, submit flags, and earn your official downloadable & printable Operator Certificate.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 pt-2">
              <span>Take Certification Exam</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Kali & Target VM Setup */}
          <Link
            href="/setup"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Kali & Target VM Setup Guide
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Step-by-step VM setup guide for Kali Linux, Metasploitable 2 & 3 targets, VirtualBox Host-Only isolated network adapters, and troubleshooting fixes.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 pt-2">
              <span>View VM Setup Guides</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Commands & Generator */}
          <Link
            href="/commands"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-cyan-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Command Generator & Cheatsheets
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Interactive flag builder for CLI tools and 50+ searchable cheatsheets covering Linux PrivEsc, SQLi payloads, and Python scripts.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 pt-2">
              <span>Open Command Generator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Metasploitable Practice Labs */}
          <Link
            href="/labs"
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Metasploitable Practice Labs
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Hands-on CTF lab challenges against Metasploitable targets. Submit flags, earn XP, track your level progression, and unlock achievements.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 pt-2">
              <span>Enter Practice Labs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
