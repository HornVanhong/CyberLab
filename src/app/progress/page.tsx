"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Flag,
  Calendar,
  Zap,
  Activity,
  Play,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";

export default function ProgressPage() {
  const {
    stats,
    challenges,
    progress,
    isChallengeCompleted,
    isChallengeUnlocked,
    getChallengeScore,
  } = useCyberLab();

  const completedChallengesList = challenges.filter((c) => isChallengeCompleted(c.id));
  const remainingChallengesList = challenges.filter((c) => !isChallengeCompleted(c.id));

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>PROGRESS & ANALYTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Learning Progress
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your skills acquisition, category mastery, and completed lab exercises.
          </p>
        </div>

        {/* Global XP & Ratio Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div className="font-mono text-xs">
              <div className="text-slate-400 text-[10px] uppercase">TOTAL SCORE</div>
              <div className="text-amber-400 font-bold text-base">{stats.totalScore} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Completion */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                OVERALL COMPLETION
              </span>
              <h2 className="text-xl font-bold text-white">
                {stats.completedChallenges} of {stats.totalChallenges} Challenges Completed
              </h2>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.progressPercentage}%
            </div>
          </div>

          <ProgressBar
            value={stats.progressPercentage}
            size="lg"
            variant="gradient"
            showValue={false}
          />

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Metasploitable 2 Module</span>
            <span className="text-emerald-400 font-semibold">
              {stats.completedChallenges === stats.totalChallenges
                ? "🏆 All Challenges Mastered!"
                : `${stats.totalChallenges - stats.completedChallenges} remaining`}
            </span>
          </div>
        </div>

        {/* Total Points / Rating */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Score Summary</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{stats.totalScore}</div>
            <p className="text-xs text-slate-400 mt-1">
              Out of {stats.maxScore} maximum possible XP points across current lab.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Accuracy / Hints:</span>
            <span className="text-cyan-400 font-bold">
              {Object.keys(progress.revealedHints).length} Hints used
            </span>
          </div>
        </div>
      </div>

      {/* Category Progress Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Category Mastery Breakdown
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">6 Skill Domains</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stats.categoryStats.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={cat.category} />
                </div>
                <div className="text-xs font-mono text-right">
                  <span className="text-white font-bold">{cat.completed}</span>
                  <span className="text-slate-400">/{cat.total} Solved</span>
                  <span className="text-emerald-400 font-bold ml-2">({cat.percentage}%)</span>
                </div>
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

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Earned XP:</span>
                <span className="text-amber-400 font-semibold">{cat.earnedXp} / {cat.totalXp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column History: Completed Challenges vs Remaining Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Challenges List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Completed Challenges ({completedChallengesList.length})
            </h2>
          </div>

          {completedChallengesList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs font-mono text-slate-400">
              No challenges completed yet. Jump into Metasploitable 2 Challenge #01 to get started!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {completedChallengesList.map((ch) => {
                const score = getChallengeScore(ch.id);
                const timestamp = progress.completionTimestamps[ch.id];

                return (
                  <Link
                    key={ch.id}
                    href={`/challenges/${ch.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                          #{ch.order.toString().padStart(2, "0")}. {ch.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ch.category}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs">
                      <div className="text-emerald-400 font-bold">+{score} XP</div>
                      {timestamp && (
                        <div className="text-[10px] text-slate-400">
                          {new Date(timestamp).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Remaining Challenges Roadmap */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4 text-cyan-400" />
              Remaining Roadmap ({remainingChallengesList.length})
            </h2>
          </div>

          {remainingChallengesList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              🎉 Congratulations! You have conquered all available challenges!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {remainingChallengesList.map((ch) => {
                const unlocked = isChallengeUnlocked(ch.id);

                return (
                  <div
                    key={ch.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      unlocked
                        ? "bg-slate-950/70 border-slate-800 hover:border-cyan-500/40"
                        : "bg-slate-950/30 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 ${
                          unlocked
                            ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                            : "bg-slate-900 border border-slate-800 text-slate-400"
                        }`}
                      >
                        {unlocked ? ch.order.toString().padStart(2, "0") : <Lock className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          #{ch.order.toString().padStart(2, "0")}. {ch.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ch.category} • {ch.difficulty}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {unlocked ? (
                        <Link
                          href={`/challenges/${ch.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start</span>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
