"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldAlert,
  Globe,
  Code,
  Search,
  Target,
  Edit2,
  Check,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Trophy,
  Layers,
  HelpCircle,
  Terminal,
  Play,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { StatusBadge, DifficultyBadge, CategoryBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";

interface PageProps {
  params: Promise<{ labId: string }>;
}

export default function LabDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { labId } = resolvedParams;

  const {
    labs,
    challenges,
    stats,
    getTargetIp,
    setTargetIp,
    isChallengeCompleted,
    isChallengeUnlocked,
  } = useCyberLab();

  const lab = labs.find((l) => l.id === labId);

  const [isEditIpOpen, setIsEditIpOpen] = useState(false);
  const currentIp = getTargetIp(labId);
  const [ipInput, setIpInput] = useState(currentIp);

  if (!lab) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Lab Not Found</h2>
        <p className="text-sm text-slate-400">The requested laboratory module does not exist.</p>
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono"
        >
          ← Back to Labs
        </Link>
      </div>
    );
  }

  const labChallenges = challenges.filter((c) => c.labId === labId);
  const completedLabChallenges = labChallenges.filter((c) => isChallengeCompleted(c.id));
  const labProgressPercent =
    labChallenges.length > 0
      ? Math.round((completedLabChallenges.length / labChallenges.length) * 100)
      : 0;

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetIp(labId, ipInput);
    setIsEditIpOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/labs" className="hover:text-emerald-400 transition-colors">
          Labs
        </Link>
        <span>/</span>
        <span className="text-slate-200">{lab.name}</span>
      </div>

      {/* Lab Header Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={lab.status} />
              <DifficultyBadge difficulty={lab.difficulty} />
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {lab.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {lab.iconName === "Globe" ? (
                <Globe className="w-8 h-8 text-cyan-400" />
              ) : lab.iconName === "Code" ? (
                <Code className="w-8 h-8 text-purple-400" />
              ) : lab.iconName === "Search" ? (
                <Search className="w-8 h-8 text-amber-400" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-emerald-400" />
              )}
              <span>{lab.name}</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">{lab.description}</p>

            {/* Editable Target IP Display */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono text-xs">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Target IP:</span>
                <span className="text-cyan-300 font-bold">{currentIp}</span>
                <button
                  onClick={() => {
                    setIpInput(currentIp);
                    setIsEditIpOpen(true);
                  }}
                  type="button"
                  className="ml-2 p-1 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit target IP"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono text-xs text-slate-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Earned XP:</span>
                <span className="text-amber-400 font-bold">{stats.totalScore} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Progress Dial / Bar */}
          <div className="lg:w-72 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">Lab Progress</span>
              <span className="text-emerald-400 font-bold text-sm">{labProgressPercent}%</span>
            </div>
            <ProgressBar value={labProgressPercent} showValue={false} size="md" variant="gradient" />
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>{completedLabChallenges.length} Solved</span>
              <span>{labChallenges.length - completedLabChallenges.length} Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions Card */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Lab Environment & Host-Only Network Setup
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">{lab.setupNotes}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {lab.prerequisites.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 font-mono flex items-start gap-2"
            >
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Challenges ({labChallenges.length})
            </h2>
            <p className="text-xs text-slate-400">
              Complete each challenge sequentially to unlock the next exercise.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {labChallenges.map((challenge, idx) => {
            const completed = isChallengeCompleted(challenge.id);
            const unlocked = isChallengeUnlocked(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all ${
                  completed
                    ? "bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                    : unlocked
                    ? "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md"
                    : "bg-slate-950/30 border-slate-900 opacity-60"
                }`}
              >
                {/* Left: Challenge Title & Badges */}
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : unlocked ? (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                        {challenge.order.toString().padStart(2, "0")}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={challenge.category} />
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        +{challenge.points} XP
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      #{challenge.order.toString().padStart(2, "0")}. {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">{challenge.objective}</p>
                  </div>
                </div>

                {/* Right: Action / Status */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {completed ? (
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-semibold transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </Link>
                  ) : unlocked ? (
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono border border-slate-900">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete previous</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target IP Edit Modal */}
      <Modal
        isOpen={isEditIpOpen}
        onClose={() => setIsEditIpOpen(false)}
        title={`Configure Target IP for ${lab.name}`}
        description="Save your target virtual machine's local subnet IP address"
      >
        <form onSubmit={handleSaveIp} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">TARGET IP ADDRESS</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.56.101"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              All challenge guides for this lab will automatically reflect this IP.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditIpOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Save IP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
