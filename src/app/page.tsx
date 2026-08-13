"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Globe,
  Code,
  Search,
  Flag,
  Trophy,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  Terminal,
  Activity,
  Sparkles,
  Server,
  Compass,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DifficultyBadge, CategoryBadge, StatusBadge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const {
    stats,
    labs,
    currentLab,
    setCurrentLab,
    challenges,
    progress,
    isChallengeCompleted,
    isChallengeUnlocked,
  } = useCyberLab();

  // Find next unfinished challenge to continue
  const nextChallenge =
    challenges.find((c) => !isChallengeCompleted(c.id) && isChallengeUnlocked(c.id)) ||
    challenges[0];

  const completedCount = stats.completedChallenges;
  const totalCount = stats.totalChallenges;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CYBERSECURITY PRACTICE ENVIRONMENT
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">CyberLab</span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Sharpen your hands-on cybersecurity skills across <strong>Metasploitable 2</strong>, <strong>OWASP Juice Shop</strong>, <strong>DVWA</strong>, and <strong>OSINT & Threat Intelligence</strong> from your Kali Linux environment.
            </p>
          </div>

          {/* Quick Continue Practice CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {nextChallenge && (
              <Link
                href={`/challenges/${nextChallenge.id}`}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                <span>Continue Practice</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <Link
              href="/labs"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Explore All Labs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Labs */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Labs</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalLabs}</div>
          <p className="text-[11px] text-emerald-400 font-mono">3 Active Modules</p>
        </div>

        {/* Total Challenges */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Challenges</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalChallenges}</div>
          <p className="text-[11px] text-slate-400">30 CTF challenges</p>
        </div>

        {/* Completed Challenges */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {completedCount} <span className="text-xs text-slate-400 font-sans">/ {totalCount}</span>
          </div>
          <div className="pt-1">
            <ProgressBar value={stats.progressPercentage} showValue={false} size="sm" />
          </div>
        </div>

        {/* Total Score */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Score</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono flex items-center gap-1.5">
            <span>{stats.totalScore}</span>
            <span className="text-xs text-slate-400 font-normal">XP</span>
          </div>
          <p className="text-[11px] text-slate-400">Max Possible: {stats.maxScore} XP</p>
        </div>
      </div>

      {/* 3 Active Labs Quick Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {labs.map((lab) => {
          const labCh = challenges.filter((c) => c.labId === lab.id);
          const solvedInLab = labCh.filter((c) => isChallengeCompleted(c.id)).length;
          const labPct = labCh.length > 0 ? Math.round((solvedInLab / labCh.length) * 100) : 0;
          const isSelected = currentLab?.id === lab.id;

          return (
            <div
              key={lab.id}
              onClick={() => setCurrentLab(lab.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {lab.iconName === "Globe" ? (
                      <Globe className="w-4 h-4 text-cyan-400" />
                    ) : lab.iconName === "Code" ? (
                      <Code className="w-4 h-4 text-purple-400" />
                    ) : lab.iconName === "Search" ? (
                      <Search className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{lab.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{lab.category}</p>
                  </div>
                </div>
                <StatusBadge status={lab.status} />
              </div>

              <div className="mt-3 space-y-1.5">
                <ProgressBar value={labPct} size="sm" showValue={false} variant={labPct === 100 ? "emerald" : "gradient"} />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{solvedInLab}/{labCh.length} Solved</span>
                  <Link
                    href={`/labs/${lab.id}`}
                    className="text-emerald-400 hover:underline flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Current Lab Focus + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Practice Lab & Next Up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lab Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {currentLab?.iconName === "Globe" ? (
                    <Globe className="w-6 h-6 text-cyan-400" />
                  ) : currentLab?.iconName === "Code" ? (
                    <Code className="w-6 h-6 text-purple-400" />
                  ) : currentLab?.iconName === "Search" ? (
                    <Search className="w-6 h-6 text-amber-400" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{currentLab?.name || "Metasploitable 2"}</h2>
                    <StatusBadge status="In Progress" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Category: {currentLab?.category} • Difficulty: {currentLab?.difficulty}
                  </p>
                </div>
              </div>

              <Link
                href={`/labs/${currentLab?.id || "metasploitable-2"}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>View Lab Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentLab?.description}
            </p>

            {/* Next challenge recommendation */}
            {nextChallenge && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                      Current Challenge
                    </span>
                    <DifficultyBadge difficulty={nextChallenge.difficulty} />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    #{nextChallenge.order.toString().padStart(2, "0")}. {nextChallenge.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{nextChallenge.objective}</p>
                </div>

                <Link
                  href={`/challenges/${nextChallenge.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Challenge</span>
                </Link>
              </div>
            )}
          </div>

          {/* Challenge Quick List Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Challenge Roadmap ({currentLab?.name})
                </h3>
              </div>
              <Link
                href="/challenges"
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
              >
                View all ({challenges.length}) →
              </Link>
            </div>

            <div className="space-y-2">
              {challenges
                .filter((c) => c.labId === (currentLab?.id || "metasploitable-2"))
                .slice(0, 5)
                .map((ch) => {
                  const completed = isChallengeCompleted(ch.id);
                  const unlocked = isChallengeUnlocked(ch.id);

                  return (
                    <Link
                      key={ch.id}
                      href={unlocked ? `/challenges/${ch.id}` : "#"}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        completed
                          ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                          : unlocked
                          ? "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200"
                          : "bg-slate-950/20 border-slate-900 text-slate-400 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : unlocked ? (
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}

                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                            <span className="font-mono text-slate-400">
                              #{ch.order.toString().padStart(2, "0")}
                            </span>
                            <span>{ch.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-400">{ch.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 font-semibold">
                          +{ch.points} XP
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Category Breakdown & Quick Tips */}
        <div className="space-y-6">
          {/* Category Progress Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Category Progress
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {stats.progressPercentage}%
              </span>
            </div>

            <div className="space-y-4">
              {stats.categoryStats.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{cat.category}</span>
                    <span className="text-slate-400">
                      {cat.completed}/{cat.total} ({cat.percentage}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={cat.percentage}
                    showValue={false}
                    size="sm"
                    variant={
                      cat.percentage === 100
                        ? "emerald"
                        : cat.percentage > 0
                        ? "cyan"
                        : "purple"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice Workflow Guide */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Practice Workflow
            </h4>
            <ol className="space-y-2.5 text-xs text-slate-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold">1.</span>
                <span>Select active Lab (Metasploitable, Juice Shop, DVWA).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold">2.</span>
                <span>Investigate manually with Kali Linux / Burp Suite.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold">3.</span>
                <span>Discover the matching flag <code className="text-emerald-300 font-mono">LAB{`{...}`}</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold">4.</span>
                <span>Submit flag to earn XP and unlock the next exercise.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
