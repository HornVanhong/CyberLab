"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Flag,
  Search,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";
import { ChallengeCategory } from "@/types/cyberlab";

export default function ChallengesPage() {
  const { challenges, isChallengeCompleted, isChallengeUnlocked, stats } = useCyberLab();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const categories: (string | ChallengeCategory)[] = [
    "All",
    "Reconnaissance",
    "Enumeration",
    "Vulnerability Analysis",
    "Initial Access",
    "Privilege Escalation",
    "Flags",
  ];

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.objective.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || c.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [challenges, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Flag className="w-4 h-4" />
            <span>CTF EXERCISES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All Challenges
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and complete cybersecurity practice tasks across all categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-bold">{stats.completedChallenges}</span>
            <span className="text-slate-400"> / {stats.totalChallenges} Solved</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            {stats.totalScore} XP
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges by title, objective, keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-xs"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {filteredChallenges.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <p className="text-sm text-slate-400">No challenges matched your search filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              className="text-xs text-emerald-400 hover:underline font-mono"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const completed = isChallengeCompleted(challenge.id);
            const unlocked = isChallengeUnlocked(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all ${
                  completed
                    ? "bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50"
                    : unlocked
                    ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    : "bg-slate-950/30 border-slate-900 opacity-60"
                }`}
              >
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

                  <div className="space-y-1">
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

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {completed ? (
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold hover:bg-emerald-500/20 transition-all"
                    >
                      <span>Completed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
