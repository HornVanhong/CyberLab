"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import {
  Flag,
  ArrowLeft,
  ArrowRight,
  Target,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";
import { TerminalBox } from "@/components/ui/TerminalBox";
import { Modal } from "@/components/ui/Modal";
import { FlagValidationResult } from "@/types/cyberlab";

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export default function ChallengeDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { challengeId } = resolvedParams;

  const {
    challenges,
    submitFlag,
    revealHint,
    isChallengeCompleted,
    isChallengeUnlocked,
    getRevealedHints,
    getChallengeScore,
    getTargetIp,
    progress,
  } = useCyberLab();

  const challenge = challenges.find((c) => c.id === challengeId);

  const [flagInput, setFlagInput] = useState("");
  const [submissionFeedback, setSubmissionFeedback] = useState<FlagValidationResult | null>(null);
  const [confirmHintId, setConfirmHintId] = useState<number | null>(null);

  // Target IP configured for this lab
  const currentIp = getTargetIp(challenge?.labId);

  // Calculate previous and next challenges
  const { prevChallenge, nextChallenge, isUnlocked, isCompleted, revealedHints, earnedScore } =
    useMemo(() => {
      if (!challenge) {
        return {
          prevChallenge: null,
          nextChallenge: null,
          isUnlocked: false,
          isCompleted: false,
          revealedHints: [],
          earnedScore: 0,
        };
      }

      const labChallenges = challenges
        .filter((c) => c.labId === challenge.labId)
        .sort((a, b) => a.order - b.order);

      const currentIndex = labChallenges.findIndex((c) => c.id === challenge.id);
      const prev = currentIndex > 0 ? labChallenges[currentIndex - 1] : null;
      const next = currentIndex < labChallenges.length - 1 ? labChallenges[currentIndex + 1] : null;

      return {
        prevChallenge: prev,
        nextChallenge: next,
        isUnlocked: isChallengeUnlocked(challenge.id),
        isCompleted: isChallengeCompleted(challenge.id),
        revealedHints: getRevealedHints(challenge.id),
        earnedScore: getChallengeScore(challenge.id),
      };
    }, [
      challenge,
      challenges,
      isChallengeUnlocked,
      isChallengeCompleted,
      getRevealedHints,
      getChallengeScore,
    ]);

  if (!challenge) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Challenge Not Found</h2>
        <p className="text-sm text-slate-400">The requested challenge could not be located.</p>
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono"
        >
          ← Back to Challenges
        </Link>
      </div>
    );
  }

  // Calculate current potential score (Points minus unlocked hint penalties)
  const totalHintPenalties = challenge.hints
    .filter((h) => revealedHints.includes(h.id))
    .reduce((sum, h) => sum + h.penalty, 0);

  const potentialPoints = Math.max(10, challenge.points - totalHintPenalties);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    const result = submitFlag(challenge.id, flagInput);
    setSubmissionFeedback(result);

    if (result.isCorrect) {
      setFlagInput("");
    }
  };

  const handleConfirmReveal = () => {
    if (confirmHintId !== null) {
      revealHint(challenge.id, confirmHintId);
      setConfirmHintId(null);
    }
  };

  const pendingHint = challenge.hints.find((h) => h.id === confirmHintId);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link
            href={`/labs/${challenge.labId}`}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Metasploitable 2</span>
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">
            Challenge #{challenge.order.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Previous & Next Navigation Buttons */}
        <div className="flex items-center gap-2">
          {prevChallenge ? (
            <Link
              href={`/challenges/${prevChallenge.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-xs font-mono text-slate-400 cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          {nextChallenge ? (
            <Link
              href={`/challenges/${nextChallenge.id}`}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isChallengeUnlocked(nextChallenge.id)
                  ? "bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400"
                  : "bg-slate-950 border border-slate-900 text-slate-400 opacity-60"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-xs font-mono text-slate-400 cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Locked Alert if applicable */}
      {!isUnlocked && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3">
          <Lock className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-bold">🔒 Locked Challenge</p>
            <p className="text-amber-400/80 font-sans text-xs mt-0.5">
              Complete the previous challenge in the lab sequence to officially unlock flag submissions for this task.
            </p>
          </div>
        </div>
      )}

      {/* Challenge Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge Overview, Instructions, Hints (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={challenge.category} />
                <DifficultyBadge difficulty={challenge.difficulty} />
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Solved ({earnedScore} XP)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{challenge.points} Max XP</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              #{challenge.order.toString().padStart(2, "0")}. {challenge.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>

            {/* Target Information Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
                <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-xs font-mono">
                  <div className="text-slate-400">TARGET HOST</div>
                  <div className="text-cyan-300 font-bold">{currentIp}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs font-mono">
                  <div className="text-slate-400">SERVICE SCOPE</div>
                  <div className="text-slate-200 font-semibold truncate">
                    {challenge.targetService || "Network Stack"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Objective & Manual Kali Guidance */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Practice Objective & Manual Steps
            </h2>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-slate-200 text-sm leading-relaxed">
              <strong className="text-emerald-400 font-mono text-xs block mb-1">OBJECTIVE:</strong>
              {challenge.objective}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Hands-On Kali Linux Guide:
              </h3>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside font-sans leading-relaxed">
                {challenge.guidance.map((step, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-200">
                      {step.replaceAll("<TARGET_IP>", currentIp)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommended Manual Commands */}
            {challenge.recommendedCommands && challenge.recommendedCommands.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Recommended Kali Commands
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Run in your Kali VM</span>
                </div>

                <div className="space-y-2.5">
                  {challenge.recommendedCommands.map((cmdItem, idx) => (
                    <TerminalBox
                      key={idx}
                      label={cmdItem.label}
                      command={cmdItem.command.replaceAll("192.168.56.101", currentIp)}
                      explanation={cmdItem.explanation}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hint System */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Investigation Hints ({revealedHints.length}/{challenge.hints.length} Unlocked)
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Current Potential:{" "}
                <span className="text-emerald-400 font-bold">{potentialPoints} XP</span>
              </span>
            </div>

            <div className="space-y-3">
              {challenge.hints.map((hint) => {
                const isRevealed = revealedHints.includes(hint.id);

                return (
                  <div
                    key={hint.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isRevealed
                        ? "bg-amber-950/20 border-amber-500/40 text-slate-200"
                        : "bg-slate-950/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          Hint #{hint.id}: {hint.title || `Clue ${hint.id}`}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          -{hint.penalty} XP
                        </span>
                      </div>

                      {isRevealed ? (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Unlocked
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmHintId(hint.id)}
                          type="button"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Reveal Hint</span>
                        </button>
                      )}
                    </div>

                    {isRevealed && (
                      <p className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-200/90 font-sans leading-relaxed">
                        {hint.text.replaceAll("<TARGET_IP>", currentIp)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Flag Submission & Verification (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flag Submission Card */}
          <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/95 p-6 space-y-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flag className="w-4 h-4" />
                  FLAG SUBMISSION
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Format:{" "}
                  <code className="text-emerald-300 font-bold">
                    {progress.settings.flagPrefix || "LAB"}{`{...}`}
                  </code>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Enter Discovered Flag</h2>
              <p className="text-xs text-slate-400">
                Validate your manual findings. Flags are verified locally in your browser.
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300">ENTER YOUR FLAG:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => {
                      setFlagInput(e.target.value);
                      if (submissionFeedback) setSubmissionFeedback(null);
                    }}
                    placeholder={`${progress.settings.flagPrefix || "LAB"}{example_flag_here}`}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-400 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!flagInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm font-mono bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <Flag className="w-4 h-4 fill-current" />
                <span>Submit Flag</span>
              </button>
            </form>

            {/* Feedback Alert */}
            {submissionFeedback && (
              <div
                className={`p-4 rounded-xl border transition-all animate-fadeIn ${
                  submissionFeedback.isCorrect
                    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
                    : !submissionFeedback.isValidFormat
                    ? "bg-amber-950/40 border-amber-500/60 text-amber-300"
                    : "bg-rose-950/40 border-rose-500/60 text-rose-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  {submissionFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : !submissionFeedback.isValidFormat ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1 font-mono text-xs">
                    <p className="font-bold text-sm">{submissionFeedback.message}</p>
                    {submissionFeedback.isCorrect && (
                      <p className="text-emerald-400/90 font-sans text-xs">
                        Excellent work! The next challenge in the roadmap is now unlocked.
                      </p>
                    )}
                    {!submissionFeedback.isValidFormat && (
                      <p className="text-amber-400/90 font-sans text-xs">
                        Ensure your flag starts with{" "}
                        <code className="text-amber-300 font-mono">
                          {progress.settings.flagPrefix || "LAB"}{"{"}
                        </code>{" "}
                        and ends with <code className="text-amber-300 font-mono">{"}"}</code>.
                      </p>
                    )}
                    {submissionFeedback.isValidFormat && !submissionFeedback.isCorrect && (
                      <p className="text-rose-400/90 font-sans text-xs">
                        Double-check your service versions, file paths, or banner strings in Kali.
                      </p>
                    )}
                  </div>
                </div>

                {/* Continue to next challenge button after success */}
                {submissionFeedback.isCorrect && nextChallenge && (
                  <div className="mt-4 pt-3 border-t border-emerald-500/30">
                    <Link
                      href={`/challenges/${nextChallenge.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 text-slate-950 font-bold text-xs font-mono hover:bg-emerald-300 transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    >
                      <span>Proceed to Challenge #{nextChallenge.order.toString().padStart(2, "0")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Educational / Safety Notice */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>HOW IT WORKS</span>
              </div>
              <p className="leading-relaxed font-sans">
                This frontend provides manual challenges and validation. You perform all scans, connections, and analysis manually from your Kali Linux terminal against your Metasploitable 2 VM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hint Reveal Confirmation Modal */}
      <Modal
        isOpen={confirmHintId !== null}
        onClose={() => setConfirmHintId(null)}
        title="Unlock Investigation Hint?"
        description={`Hint #${pendingHint?.id} will reduce your potential reward by ${pendingHint?.penalty} XP.`}
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
            <p className="font-bold">⚠️ XP Penalty Notice</p>
            <p className="text-amber-400/90 font-sans text-xs">
              Revealing this clue will deduct <strong>{pendingHint?.penalty} XP</strong> from this challenge&apos;s completion points.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmHintId(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Keep Thinking
            </button>
            <button
              type="button"
              onClick={handleConfirmReveal}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            >
              Reveal Hint (-{pendingHint?.penalty} XP)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
