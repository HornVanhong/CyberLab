export type Difficulty = "Easy" | "Medium" | "Hard";

export type ChallengeCategory =
  | "Reconnaissance"
  | "Enumeration"
  | "Vulnerability Analysis"
  | "Initial Access"
  | "Privilege Escalation"
  | "Flags";

export type LabCategory = "Network Security" | "Web Security" | "OSINT & Intelligence" | "Binary Exploitation" | "Cloud Security";

export type LabStatus = "In Progress" | "Available" | "Coming Soon";

export interface Hint {
  id: number;
  title?: string;
  text: string;
  penalty: number;
}

export interface RecommendedCommand {
  label: string;
  command: string;
  explanation: string;
}

export interface Challenge {
  id: string;
  labId: string;
  order: number;
  title: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  points: number;
  description: string;
  objective: string;
  guidance: string[];
  recommendedCommands?: RecommendedCommand[];
  targetService?: string;
  flagFormat: string;
  expectedFlag: string;
  hints: Hint[];
}

export interface Lab {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: LabCategory;
  difficulty: string;
  status: LabStatus;
  defaultTargetIp: string;
  iconName: string;
  badge: string;
  totalChallenges: number;
  estimatedTime: string;
  prerequisites: string[];
  setupNotes: string;
}

export interface UserSettings {
  defaultTargetIp: string;
  flagPrefix: string;
  soundEffects: boolean;
  theme: "dark" | "cyber" | "matrix";
}

export interface ProgressState {
  completedChallenges: string[];
  scores: Record<string, number>; // challengeId -> score earned
  revealedHints: Record<string, number[]>; // challengeId -> array of revealed hint IDs
  attempts: Record<string, number>; // challengeId -> number of submission attempts
  lastChallenge: string | null;
  currentLabId: string;
  targetIps: Record<string, string>; // labId -> custom target IP
  settings: UserSettings;
  completionTimestamps: Record<string, string>; // challengeId -> ISO string
}

export interface FlagValidationResult {
  isValidFormat: boolean;
  isCorrect: boolean;
  message: string;
  pointsEarned?: number;
  penaltyApplied?: number;
}
