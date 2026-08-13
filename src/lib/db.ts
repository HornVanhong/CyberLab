import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  xp: number;
  level: number;
  title: string;
  createdAt: string;
}

export interface ProgressRecord {
  id: string;
  userId: string;
  labId: string;
  challengeId: string;
  solved: boolean;
  flagSubmitted: string;
  solvedAt: string;
  hintsUnlocked: boolean;
}

export interface SubmissionLog {
  id: string;
  userId: string;
  labId: string;
  challengeId: string;
  flagSubmitted: string;
  isCorrect: boolean;
  submittedAt: string;
}

export interface CertificateRecord {
  certificateId: string;
  userId: string;
  candidateName: string;
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  issuedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  progress: ProgressRecord[];
  submissions: SubmissionLog[];
  certificates: CertificateRecord[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "cyberlab_db.json");

// Helper to Hash Passwords
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "cyberlab_salt_2026").digest("hex");
}

// Ensure DB File Exists
function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        users: [
          {
            id: "user-admin-01",
            username: "admin",
            email: "admin@cyberlab.local",
            passwordHash: hashPassword("admin123"),
            role: "admin",
            xp: 1250,
            level: 5,
            title: "Cyber Master",
            createdAt: new Date().toISOString(),
          },
          {
            id: "user-student-01",
            username: "student",
            email: "student@cyberlab.local",
            passwordHash: hashPassword("student123"),
            role: "student",
            xp: 450,
            level: 2,
            title: "Security Trainee",
            createdAt: new Date().toISOString(),
          },
        ],
        progress: [],
        submissions: [],
        certificates: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }

    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data) as DatabaseSchema;
  } catch (err) {
    console.error("Database access error:", err);
    return { users: [], progress: [], submissions: [], certificates: [] };
  }
}

function saveDb(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save database:", err);
  }
}

// User Queries
export function getUserByEmail(email: string): UserRecord | undefined {
  const db = getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): UserRecord | undefined {
  const db = getDb();
  return db.users.find((u) => u.id === id);
}

export function createUser(username: string, email: string, passwordPlain: string): UserRecord {
  const db = getDb();
  const newUser: UserRecord = {
    id: `user-${crypto.randomBytes(6).toString("hex")}`,
    username,
    email,
    passwordHash: hashPassword(passwordPlain),
    role: "student",
    xp: 0,
    level: 1,
    title: "Novice Hacker",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUserXp(userId: string, addedXp: number): UserRecord | undefined {
  const db = getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return undefined;

  user.xp += addedXp;
  user.level = Math.floor(user.xp / 250) + 1;

  if (user.level >= 10) user.title = "Legendary Pentester";
  else if (user.level >= 5) user.title = "Cyber Specialist";
  else if (user.level >= 3) user.title = "Security Analyst";
  else user.title = "Security Trainee";

  saveDb(db);
  return user;
}

// Progress & Flag Submissions
export function recordSubmission(
  userId: string,
  labId: string,
  challengeId: string,
  flagSubmitted: string,
  isCorrect: boolean
): { progress?: ProgressRecord; submission: SubmissionLog } {
  const db = getDb();

  const submission: SubmissionLog = {
    id: `sub-${crypto.randomBytes(6).toString("hex")}`,
    userId,
    labId,
    challengeId,
    flagSubmitted,
    isCorrect,
    submittedAt: new Date().toISOString(),
  };
  db.submissions.push(submission);

  let progress: ProgressRecord | undefined;

  if (isCorrect) {
    let existingProgress = db.progress.find(
      (p) => p.userId === userId && p.challengeId === challengeId
    );
    if (!existingProgress) {
      existingProgress = {
        id: `prog-${crypto.randomBytes(6).toString("hex")}`,
        userId,
        labId,
        challengeId,
        solved: true,
        flagSubmitted,
        solvedAt: new Date().toISOString(),
        hintsUnlocked: false,
      };
      db.progress.push(existingProgress);
    } else {
      existingProgress.solved = true;
      existingProgress.flagSubmitted = flagSubmitted;
      existingProgress.solvedAt = new Date().toISOString();
    }
    progress = existingProgress;
  }

  saveDb(db);
  return { progress, submission };
}

export function getUserProgress(userId: string): ProgressRecord[] {
  const db = getDb();
  return db.progress.filter((p) => p.userId === userId);
}

// Certificates
export function saveCertificate(
  userId: string,
  candidateName: string,
  score: number,
  tasksCompleted: number,
  totalTasks: number
): CertificateRecord {
  const db = getDb();
  const cert: CertificateRecord = {
    certificateId: `CYBERLAB-${crypto.randomBytes(4).toString("hex").toUpperCase()}-2026`,
    userId,
    candidateName,
    score,
    tasksCompleted,
    totalTasks,
    issuedAt: new Date().toISOString(),
  };
  db.certificates.push(cert);
  saveDb(db);
  return cert;
}

export function getCertificateById(certificateId: string): CertificateRecord | undefined {
  const db = getDb();
  return db.certificates.find((c) => c.certificateId.toUpperCase() === certificateId.toUpperCase());
}
