"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  Challenge,
  ChallengeCategory,
  FlagValidationResult,
  Lab,
  ProgressState,
  UserSettings,
} from "../types/cyberlab";
import { CHALLENGES } from "../data/challenges";
import { LABS } from "../data/labs";
import {
  clearProgressStorage,
  DEFAULT_SETTINGS,
  importProgressFromJson,
  INITIAL_PROGRESS_STATE,
  loadProgressFromStorage,
  saveProgressToStorage,
} from "../lib/storage";
import { playSound } from "../lib/sound";
import { triggerConfetti } from "../lib/celebrate";
import { useAuth } from "./AuthContext";

interface CategoryStat {
  category: ChallengeCategory;
  total: number;
  completed: number;
  percentage: number;
  earnedXp: number;
  totalXp: number;
}

interface OverallStats {
  totalLabs: number;
  totalChallenges: number;
  completedChallenges: number;
  totalScore: number;
  maxScore: number;
  progressPercentage: number;
  categoryStats: CategoryStat[];
}

interface CyberLabContextType {
  progress: ProgressState;
  isLoaded: boolean;
  labs: Lab[];
  challenges: Challenge[];
  stats: OverallStats;
  currentLab: Lab | undefined;
  submitFlag: (challengeId: string, flag: string) => FlagValidationResult;
  revealHint: (challengeId: string, hintId: number) => void;
  setTargetIp: (labId: string, ip: string) => void;
  setCurrentLab: (labId: string) => void;
  setLastChallenge: (challengeId: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetAllProgress: () => void;
  importProgress: (json: string) => boolean;
  isChallengeUnlocked: (challengeId: string) => boolean;
  isChallengeCompleted: (challengeId: string) => boolean;
  getRevealedHints: (challengeId: string) => number[];
  getChallengeScore: (challengeId: string) => number;
  getTargetIp: (labId?: string) => string;
}

const CyberLabContext = createContext<CyberLabContextType | null>(null);

export function CyberLabProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(INITIAL_PROGRESS_STATE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 1. Load from localStorage on client mount
  useEffect(() => {
    const loaded = loadProgressFromStorage();
    setProgress(loaded);
    setIsLoaded(true);
  }, []);

  // 2. Load and merge from PostgreSQL Database if user is authenticated
  useEffect(() => {
    if (isLoaded && user?.uid) {
      fetch(`/api/progress?userId=${encodeURIComponent(user.uid)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.progress) {
            const dbP = data.progress;
            setProgress((prev) => ({
              ...prev,
              currentLabId: dbP.current_lab_id || prev.currentLabId,
              completedChallenges: Array.from(
                new Set([...(prev.completedChallenges || []), ...(dbP.completed_challenges || [])])
              ),
              revealedHints: { ...prev.revealedHints, ...(dbP.revealed_hints || {}) },
              scores: { ...prev.scores, ...(dbP.scores || {}) },
              attempts: { ...prev.attempts, ...(dbP.attempts || {}) },
              targetIps: { ...prev.targetIps, ...(dbP.target_ips || {}) },
              settings: { ...prev.settings, ...(dbP.settings || {}) },
              lastChallenge: dbP.last_challenge || prev.lastChallenge,
            }));
          }
        })
        .catch((err) => console.error("Database sync fetch error:", err));
    }
  }, [user?.uid, isLoaded]);

  // 3. Save to localStorage on state changes once loaded
  useEffect(() => {
    if (isLoaded) {
      saveProgressToStorage(progress);
    }
  }, [progress, isLoaded]);

  // Compute Overall Stats
  const stats: OverallStats = useMemo(() => {
    const totalLabs = LABS.length;
    const totalChallenges = CHALLENGES.length;
    const completedChallenges = progress.completedChallenges.length;

    const totalScore = Object.values(progress.scores).reduce((sum, s) => sum + (s || 0), 0);
    const maxScore = CHALLENGES.reduce((sum, c) => sum + c.points, 0);
    const progressPercentage = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

    const categories: ChallengeCategory[] = [
      "Reconnaissance",
      "Enumeration",
      "Vulnerability Analysis",
      "Initial Access",
      "Privilege Escalation",
      "Flags",
    ];

    const categoryStats: CategoryStat[] = categories.map((cat) => {
      const catChallenges = CHALLENGES.filter((c) => c.category === cat);
      const catCompleted = catChallenges.filter((c) => progress.completedChallenges.includes(c.id));
      const totalXp = catChallenges.reduce((sum, c) => sum + c.points, 0);
      const earnedXp = catCompleted.reduce((sum, c) => sum + (progress.scores[c.id] || c.points), 0);
      const percentage = catChallenges.length > 0 ? Math.round((catCompleted.length / catChallenges.length) * 100) : 0;

      return {
        category: cat,
        total: catChallenges.length,
        completed: catCompleted.length,
        percentage,
        earnedXp,
        totalXp,
      };
    });

    return {
      totalLabs,
      totalChallenges,
      completedChallenges,
      totalScore,
      maxScore,
      progressPercentage,
      categoryStats,
    };
  }, [progress.completedChallenges, progress.scores]);

  // 4. Sync progress to PostgreSQL Database when progress or totalScore changes
  useEffect(() => {
    if (isLoaded && user?.uid) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          progress: {
            currentLabId: progress.currentLabId,
            completedChallenges: progress.completedChallenges,
            revealedHints: progress.revealedHints,
            scores: progress.scores,
            attempts: progress.attempts,
            targetIps: progress.targetIps,
            settings: progress.settings,
            lastChallenge: progress.lastChallenge,
            totalScore: stats.totalScore,
          },
        }),
      }).catch((err) => console.error("Database sync save error:", err));
    }
  }, [progress, user?.uid, user?.email, isLoaded, stats.totalScore]);

  // Check if a challenge is unlocked
  const isChallengeUnlocked = useCallback(
    (challengeId: string): boolean => {
      const challenge = CHALLENGES.find((c) => c.id === challengeId);
      if (!challenge) return false;

      const labChallenges = CHALLENGES.filter((c) => c.labId === challenge.labId).sort(
        (a, b) => a.order - b.order
      );

      const index = labChallenges.findIndex((c) => c.id === challengeId);
      if (index <= 0) return true;

      const previousChallenge = labChallenges[index - 1];
      return progress.completedChallenges.includes(previousChallenge.id);
    },
    [progress.completedChallenges]
  );

  const isChallengeCompleted = useCallback(
    (challengeId: string): boolean => {
      return progress.completedChallenges.includes(challengeId);
    },
    [progress.completedChallenges]
  );

  const getRevealedHints = useCallback(
    (challengeId: string): number[] => {
      return progress.revealedHints[challengeId] || [];
    },
    [progress.revealedHints]
  );

  const getChallengeScore = useCallback(
    (challengeId: string): number => {
      return progress.scores[challengeId] || 0;
    },
    [progress.scores]
  );

  const getTargetIp = useCallback(
    (labId?: string): string => {
      const activeLabId = labId || progress.currentLabId || "metasploitable-2";
      return progress.targetIps[activeLabId] || progress.settings.defaultTargetIp || "192.168.56.101";
    },
    [progress.targetIps, progress.currentLabId, progress.settings.defaultTargetIp]
  );

  // Submit and validate flag
  const submitFlag = useCallback(
    (challengeId: string, submittedFlag: string): FlagValidationResult => {
      const challenge = CHALLENGES.find((c) => c.id === challengeId);
      if (!challenge) {
        return {
          isValidFormat: false,
          isCorrect: false,
          message: "Challenge not found.",
        };
      }

      const trimmed = submittedFlag.trim();
      const prefix = progress.settings.flagPrefix || "LAB";
      const formatRegex = new RegExp(`^${prefix}\\{[^{}]+\\}$`, "i");

      const currentAttempts = (progress.attempts[challengeId] || 0) + 1;

      if (!formatRegex.test(trimmed)) {
        playSound("error", progress.settings.soundEffects);
        setProgress((prev) => ({
          ...prev,
          attempts: { ...prev.attempts, [challengeId]: currentAttempts },
        }));

        if (user?.uid) {
          fetch("/api/log-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.uid,
              challengeId,
              submittedFlag: trimmed,
              isCorrect: false,
              pointsEarned: 0,
            }),
          }).catch(() => {});
        }

        return {
          isValidFormat: false,
          isCorrect: false,
          message: `Invalid flag format. Expected format: ${prefix}{...}`,
        };
      }

      const isCorrect = trimmed.toLowerCase() === challenge.expectedFlag.toLowerCase();

      if (!isCorrect) {
        playSound("error", progress.settings.soundEffects);
        setProgress((prev) => ({
          ...prev,
          attempts: { ...prev.attempts, [challengeId]: currentAttempts },
        }));

        if (user?.uid) {
          fetch("/api/log-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.uid,
              challengeId,
              submittedFlag: trimmed,
              isCorrect: false,
              pointsEarned: 0,
            }),
          }).catch(() => {});
        }

        return {
          isValidFormat: true,
          isCorrect: false,
          message: "✗ Incorrect Flag. Try again.",
        };
      }

      // Calculate penalties from revealed hints
      const revealed = progress.revealedHints[challengeId] || [];
      const totalPenalty = challenge.hints
        .filter((h) => revealed.includes(h.id))
        .reduce((sum, h) => sum + h.penalty, 0);

      const pointsEarned = Math.max(10, challenge.points - totalPenalty);

      playSound("success", progress.settings.soundEffects);
      triggerConfetti();

      if (user?.uid) {
        fetch("/api/log-attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            challengeId,
            submittedFlag: trimmed,
            isCorrect: true,
            pointsEarned,
          }),
        }).catch(() => {});
      }

      setProgress((prev) => {
        const isAlreadyCompleted = prev.completedChallenges.includes(challengeId);
        const updatedCompleted = isAlreadyCompleted
          ? prev.completedChallenges
          : [...prev.completedChallenges, challengeId];

        return {
          ...prev,
          completedChallenges: updatedCompleted,
          scores: {
            ...prev.scores,
            [challengeId]: isAlreadyCompleted ? prev.scores[challengeId] || pointsEarned : pointsEarned,
          },
          attempts: {
            ...prev.attempts,
            [challengeId]: currentAttempts,
          },
          lastChallenge: challengeId,
          completionTimestamps: {
            ...prev.completionTimestamps,
            [challengeId]: prev.completionTimestamps[challengeId] || new Date().toISOString(),
          },
        };
      });

      return {
        isValidFormat: true,
        isCorrect: true,
        message: `✓ Correct Flag! +${pointsEarned} XP Challenge Completed`,
        pointsEarned,
        penaltyApplied: totalPenalty,
      };
    },
    [progress, user?.uid]
  );

  const revealHint = useCallback(
    (challengeId: string, hintId: number) => {
      playSound("hint", progress.settings.soundEffects);
      setProgress((prev) => {
        const currentRevealed = prev.revealedHints[challengeId] || [];
        if (currentRevealed.includes(hintId)) return prev;

        return {
          ...prev,
          revealedHints: {
            ...prev.revealedHints,
            [challengeId]: [...currentRevealed, hintId],
          },
        };
      });
    },
    [progress.settings.soundEffects]
  );

  const setTargetIp = useCallback((labId: string, ip: string) => {
    const cleanIp = ip.trim();
    setProgress((prev) => ({
      ...prev,
      targetIps: {
        ...prev.targetIps,
        [labId]: cleanIp,
      },
    }));
  }, []);

  const setCurrentLab = useCallback((labId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentLabId: labId,
    }));
  }, []);

  const setLastChallenge = useCallback((challengeId: string) => {
    setProgress((prev) => ({
      ...prev,
      lastChallenge: challengeId,
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = clearProgressStorage();
    setProgress(fresh);
  }, []);

  const importProgress = useCallback((json: string): boolean => {
    const imported = importProgressFromJson(json);
    if (imported) {
      setProgress(imported);
      return true;
    }
    return false;
  }, []);

  const currentLab = useMemo(() => {
    return LABS.find((l) => l.id === progress.currentLabId) || LABS[0];
  }, [progress.currentLabId]);

  return (
    <CyberLabContext.Provider
      value={{
        progress,
        isLoaded,
        labs: LABS,
        challenges: CHALLENGES,
        stats,
        currentLab,
        submitFlag,
        revealHint,
        setTargetIp,
        setCurrentLab,
        setLastChallenge,
        updateSettings,
        resetAllProgress,
        importProgress,
        isChallengeUnlocked,
        isChallengeCompleted,
        getRevealedHints,
        getChallengeScore,
        getTargetIp,
      }}
    >
      {children}
    </CyberLabContext.Provider>
  );
}

export function useCyberLab() {
  const context = useContext(CyberLabContext);
  if (!context) {
    throw new Error("useCyberLab must be used within a CyberLabProvider");
  }
  return context;
}
