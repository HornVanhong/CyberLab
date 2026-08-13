import { ProgressState, UserSettings } from "@/types/cyberlab";

const STORAGE_KEY = "cyberlab_progress_v1";

export const DEFAULT_SETTINGS: UserSettings = {
  defaultTargetIp: "192.168.56.101",
  flagPrefix: "LAB",
  soundEffects: true,
  theme: "cyber",
};

export const INITIAL_PROGRESS_STATE: ProgressState = {
  completedChallenges: [],
  scores: {},
  revealedHints: {},
  attempts: {},
  lastChallenge: "ms2-001",
  currentLabId: "metasploitable-2",
  targetIps: {
    "metasploitable-2": "192.168.56.101",
    "owasp-juice-shop": "192.168.56.102",
    dvwa: "192.168.56.103",
  },
  settings: DEFAULT_SETTINGS,
  completionTimestamps: {},
};

export function loadProgressFromStorage(): ProgressState {
  if (typeof window === "undefined") {
    return INITIAL_PROGRESS_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_PROGRESS_STATE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS_STATE,
      ...parsed,
      targetIps: {
        ...INITIAL_PROGRESS_STATE.targetIps,
        ...(parsed.targetIps || {}),
      },
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
    };
  } catch (err) {
    console.error("Failed to parse CyberLab progress from localStorage:", err);
    return INITIAL_PROGRESS_STATE;
  }
}

export function saveProgressToStorage(state: ProgressState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save CyberLab progress to localStorage:", err);
  }
}

export function exportProgressAsJson(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function importProgressFromJson(jsonString: string): ProgressState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") return null;

    const validated: ProgressState = {
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      scores: typeof parsed.scores === "object" && parsed.scores !== null ? parsed.scores : {},
      revealedHints: typeof parsed.revealedHints === "object" && parsed.revealedHints !== null ? parsed.revealedHints : {},
      attempts: typeof parsed.attempts === "object" && parsed.attempts !== null ? parsed.attempts : {},
      lastChallenge: typeof parsed.lastChallenge === "string" ? parsed.lastChallenge : "ms2-001",
      currentLabId: typeof parsed.currentLabId === "string" ? parsed.currentLabId : "metasploitable-2",
      targetIps: {
        ...INITIAL_PROGRESS_STATE.targetIps,
        ...(parsed.targetIps || {}),
      },
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
      completionTimestamps: typeof parsed.completionTimestamps === "object" && parsed.completionTimestamps !== null ? parsed.completionTimestamps : {},
    };

    saveProgressToStorage(validated);
    return validated;
  } catch (err) {
    console.error("Failed to import progress JSON:", err);
    return null;
  }
}

export function clearProgressStorage(): ProgressState {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to remove CyberLab progress from localStorage:", err);
    }
  }
  return INITIAL_PROGRESS_STATE;
}
