"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Layers,
  HelpCircle,
  Flag,
  BarChart3,
  Settings,
  Terminal,
  ChevronRight,
  Server,
  Zap,
  Wrench,
  BookOpen,
  Globe,
  ExternalLink,
  Award,
  Cpu,
  Database,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCyberLab } from "@/context/CyberLabContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Operator Profile", href: "/profile", icon: User, badge: "Account" },
  { name: "Labs", href: "/labs", icon: Layers },
  { name: "Challenges", href: "/challenges", icon: Flag },
  { name: "Learn Tools", href: "/tools", icon: Wrench, badge: "Academy" },
  { name: "Kali & Target VM Setup", href: "/setup", icon: Cpu, badge: "Guide" },
  { name: "OSINT Web Links", href: "/osint-resources", icon: Globe, badge: "Portals" },
  { name: "OSINT & Kali Exam", href: "/exam", icon: Award, badge: "Cert" },
  { name: "Commands & Generator", href: "/commands", icon: Terminal },
  { name: "Flag & Command Quiz", href: "/quiz", icon: HelpCircle, badge: "Interactive" },
  { name: "Database Explorer", href: "/admin", icon: Database, badge: "PostgreSQL" },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { stats, currentLab } = useCyberLab();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
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
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">PRACTICE ENVIRONMENT</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Navigation
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold border border-slate-700/60 shrink-0">
                    {item.badge}
                  </span>
                )}
                {item.name === "Progress" && (
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-slate-700/60 shrink-0">
                    {stats.progressPercentage}%
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Active Lab Widget */}
          <div className="pt-6">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Active Target</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>

            <Link
              href={`/labs/${currentLab?.id || "metasploitable-2"}`}
              onClick={onClose}
              className="block p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {currentLab?.name || "Metasploitable 2"}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>{stats.completedChallenges} / {stats.totalChallenges} Solved</span>
                <span className="text-emerald-400 font-semibold">{stats.totalScore} XP</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Lab Environment Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="relative flex items-center justify-center w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate flex items-center gap-1">
                <span>Local Practice</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono truncate">Kali & Metasploitable</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
