"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Globe,
  Code,
  Search,
  ArrowRight,
  Lock,
  Clock,
  Flag,
  Server,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { StatusBadge, DifficultyBadge, Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function LabsPage() {
  const { labs, challenges, isChallengeCompleted } = useCyberLab();

  const getLabIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="w-7 h-7 text-emerald-400" />;
      case "Globe":
        return <Globe className="w-7 h-7 text-cyan-400" />;
      case "Code":
        return <Code className="w-7 h-7 text-purple-400" />;
      case "Search":
        return <Search className="w-7 h-7 text-amber-400" />;
      default:
        return <Server className="w-7 h-7 text-slate-400" />;
    }
  };

  const activeLabsCount = labs.filter((l) => l.status === "In Progress" || l.status === "Available").length;

  return (
    <AuthGuard>
      <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>TRAINING MODULES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cyber Practice Labs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select a target practice laboratory to begin your manual security assessment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">{activeLabsCount}</span> Active Labs
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            30 Total Challenges
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => {
          const isAvailable = lab.status === "In Progress" || lab.status === "Available";
          const labChallenges = challenges.filter((c) => c.labId === lab.id);
          const completedCount = labChallenges.filter((c) => isChallengeCompleted(c.id)).length;
          const progressVal =
            labChallenges.length > 0 ? Math.round((completedCount / labChallenges.length) * 100) : 0;

          return (
            <div
              key={lab.id}
              className={`flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden ${
                isAvailable
                  ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] group"
                  : "bg-slate-950/40 border-slate-900 opacity-75"
              }`}
            >
              <div className="p-6 space-y-5">
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-xl border ${
                      isAvailable
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    {getLabIcon(lab.iconName)}
                  </div>
                  <StatusBadge status={lab.status} />
                </div>

                {/* Lab Title & Category */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">
                      {lab.category}
                    </Badge>
                    <DifficultyBadge difficulty={lab.difficulty} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {lab.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {lab.tagline}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <ProgressBar
                    value={progressVal}
                    label="Progress"
                    sublabel={`${completedCount}/${labChallenges.length} Solved`}
                    size="sm"
                    variant={progressVal === 100 ? "emerald" : "gradient"}
                  />
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lab.totalChallenges} Challenges</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lab.estimatedTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/labs/${lab.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <span>Enter Lab Environment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </AuthGuard>
  );
}
