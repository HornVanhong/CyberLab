import { Pool } from "pg";
import crypto from "crypto";

// PostgreSQL Connection Pool Setup for Render Database
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production" || (connectionString && connectionString.includes("render.com"))
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  role: string;
  xp: number;
  level: number;
  title: string;
  passwordHash?: string;
}

/**
 * Security Helper: Sanitize text inputs to trim whitespace & strip null byte characters
 */
export function sanitizeInput(input: any): string {
  if (typeof input !== "string") return String(input || "");
  return input.trim().replace(/\0/g, "");
}

/**
 * Hash password string using SHA-256 with static salt
 */
export function hashPassword(password: string): string {
  const cleanPass = sanitizeInput(password);
  return crypto.createHash("sha256").update(cleanPass + "cyberlab_salt_2026").digest("hex");
}

/**
 * Initialize all database tables for CyberLab
 * Strictly uses static SQL statement definitions with ZERO dynamic input interpolation
 */
export async function initDatabase() {
  if (!connectionString) {
    console.warn("⚠️ DATABASE_URL environment variable is not defined. Skipping PostgreSQL init.");
    return { success: false, error: "DATABASE_URL is missing" };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. User Progress Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        current_lab_id VARCHAR(100) DEFAULT 'metasploitable-2',
        completed_challenges JSONB DEFAULT '[]'::jsonb,
        revealed_hints JSONB DEFAULT '{}'::jsonb,
        scores JSONB DEFAULT '{}'::jsonb,
        attempts JSONB DEFAULT '{}'::jsonb,
        target_ips JSONB DEFAULT '{}'::jsonb,
        settings JSONB DEFAULT '{}'::jsonb,
        last_challenge VARCHAR(100),
        total_score INT DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Challenge Submission Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS challenge_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        challenge_id VARCHAR(100) NOT NULL,
        submitted_flag TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        points_earned INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Exam & Quiz Progress Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        quiz_type VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        max_score INT NOT NULL,
        passed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("✅ Render PostgreSQL Database Schema initialized successfully.");
    return { success: true, message: "Database schema initialized" };
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("❌ Database schema initialization error:", error);
    return { success: false, error: error?.message || "Failed to initialize database" };
  } finally {
    client.release();
  }
}

/**
 * Execute custom SQL query safely with parameterized values ($1, $2, etc.)
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

/**
 * Create new user safely using parameterized query bindings
 */
export function createUser(username: string, email: string, password: string): UserRecord {
  const cleanUsername = sanitizeInput(username);
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const id = "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const passwordHash = hashPassword(password);

  const user: UserRecord = {
    id,
    username: cleanUsername,
    email: cleanEmail,
    display_name: cleanUsername,
    role: "student",
    xp: 0,
    level: 1,
    title: "Novice Hacker",
    passwordHash,
  };

  if (connectionString) {
    // 100% Parameterized query: $1, $2, $3 prevents SQL injection
    pool.query(
      `INSERT INTO users (id, email, display_name, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;`,
      [id, cleanEmail, cleanUsername]
    ).catch((err) => console.error("createUser DB error:", err));
  }

  return user;
}

/**
 * Save user profile safely to database
 */
export async function upsertUser(id: string, email: string, displayName?: string): Promise<UserRecord> {
  const cleanId = sanitizeInput(id);
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const cleanName = displayName ? sanitizeInput(displayName) : cleanEmail.split("@")[0];

  const text = `
    INSERT INTO users (id, email, display_name, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  // 100% Parameterized query: $1, $2, $3 prevents SQL injection
  const res = await pool.query(text, [cleanId, cleanEmail, cleanName]);
  const row = res.rows[0];
  return {
    id: row.id,
    username: row.display_name || row.email.split("@")[0],
    email: row.email,
    display_name: row.display_name,
    role: "student",
    xp: 0,
    level: 1,
    title: "Novice Hacker",
  };
}

/**
 * Get user by ID safely from database
 */
export async function getUserById(id: string): Promise<UserRecord | null> {
  const cleanId = sanitizeInput(id);
  if (!connectionString) {
    return {
      id: cleanId,
      username: "Operator",
      email: "operator@cyberlab.local",
      role: "student",
      xp: 0,
      level: 1,
      title: "Novice Hacker",
    };
  }
  try {
    // 100% Parameterized query: $1 prevents SQL injection
    const text = `SELECT * FROM users WHERE id = $1;`;
    const res = await pool.query(text, [cleanId]);
    const row = res.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      username: row.display_name || row.email.split("@")[0],
      email: row.email,
      display_name: row.display_name,
      role: "student",
      xp: 0,
      level: 1,
      title: "Novice Hacker",
    };
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
}

/**
 * Get user by Email safely from database
 */
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = sanitizeInput(email).toLowerCase();
  if (!connectionString) return null;
  try {
    // 100% Parameterized query: $1 prevents SQL injection
    const text = `SELECT * FROM users WHERE email = $1;`;
    const res = await pool.query(text, [cleanEmail]);
    const row = res.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      username: row.display_name || row.email.split("@")[0],
      email: row.email,
      display_name: row.display_name,
      role: "student",
      xp: 0,
      level: 1,
      title: "Novice Hacker",
    };
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
}

/**
 * Get user progress safely from database
 */
export async function getUserProgress(userId: string) {
  const cleanUserId = sanitizeInput(userId);
  if (!connectionString) return null;
  // 100% Parameterized query: $1 prevents SQL injection
  const text = `SELECT * FROM user_progress WHERE user_id = $1;`;
  const res = await pool.query(text, [cleanUserId]);
  return res.rows[0] || null;
}

/**
 * Save / sync user progress safely to database
 */
export async function saveUserProgress(
  userId: string,
  progressData: {
    currentLabId?: string;
    completedChallenges?: string[];
    revealedHints?: Record<string, number[]>;
    scores?: Record<string, number>;
    attempts?: Record<string, number>;
    targetIps?: Record<string, string>;
    settings?: any;
    lastChallenge?: string;
    totalScore?: number;
  }
) {
  const cleanUserId = sanitizeInput(userId);
  if (!connectionString) return null;

  const text = `
    INSERT INTO user_progress (
      user_id, current_lab_id, completed_challenges, revealed_hints, scores, attempts, target_ips, settings, last_challenge, total_score, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE
    SET current_lab_id = COALESCE(EXCLUDED.current_lab_id, user_progress.current_lab_id),
        completed_challenges = COALESCE(EXCLUDED.completed_challenges, user_progress.completed_challenges),
        revealed_hints = COALESCE(EXCLUDED.revealed_hints, user_progress.revealed_hints),
        scores = COALESCE(EXCLUDED.scores, user_progress.scores),
        attempts = COALESCE(EXCLUDED.attempts, user_progress.attempts),
        target_ips = COALESCE(EXCLUDED.target_ips, user_progress.target_ips),
        settings = COALESCE(EXCLUDED.settings, user_progress.settings),
        last_challenge = COALESCE(EXCLUDED.last_challenge, user_progress.last_challenge),
        total_score = COALESCE(EXCLUDED.total_score, user_progress.total_score),
        updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  // 100% Parameterized query: $1 through $10 prevents SQL injection
  const res = await pool.query(text, [
    cleanUserId,
    sanitizeInput(progressData.currentLabId || "metasploitable-2"),
    JSON.stringify(progressData.completedChallenges || []),
    JSON.stringify(progressData.revealedHints || {}),
    JSON.stringify(progressData.scores || {}),
    JSON.stringify(progressData.attempts || {}),
    JSON.stringify(progressData.targetIps || {}),
    JSON.stringify(progressData.settings || {}),
    progressData.lastChallenge ? sanitizeInput(progressData.lastChallenge) : null,
    Number(progressData.totalScore || 0),
  ]);

  return res.rows[0];
}

/**
 * Log a challenge flag attempt safely to database
 */
export async function logChallengeAttempt(
  userId: string,
  challengeId: string,
  submittedFlag: string,
  isCorrect: boolean,
  pointsEarned: number
) {
  if (!connectionString) return null;
  const cleanUserId = sanitizeInput(userId);
  const cleanChallengeId = sanitizeInput(challengeId);
  const cleanFlag = sanitizeInput(submittedFlag);

  const text = `
    INSERT INTO challenge_logs (user_id, challenge_id, submitted_flag, is_correct, points_earned)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  // 100% Parameterized query: $1-$5 prevents SQL injection
  const res = await pool.query(text, [cleanUserId, cleanChallengeId, cleanFlag, Boolean(isCorrect), Number(pointsEarned)]);
  return res.rows[0];
}

/**
 * Legacy API helper: recordSubmission
 */
export function recordSubmission(
  userId: string,
  labId: string,
  challengeId: string,
  flag: string,
  isCorrect: boolean
) {
  const cleanUserId = sanitizeInput(userId);
  const cleanChallengeId = sanitizeInput(challengeId);
  const cleanFlag = sanitizeInput(flag);

  const submission = {
    id: "sub_" + Date.now(),
    userId: cleanUserId,
    labId: sanitizeInput(labId),
    challengeId: cleanChallengeId,
    flag: cleanFlag,
    isCorrect,
    timestamp: new Date().toISOString(),
  };

  if (connectionString) {
    // 100% Parameterized query: $1-$5 prevents SQL injection
    pool.query(
      `INSERT INTO challenge_logs (user_id, challenge_id, submitted_flag, is_correct, points_earned) VALUES ($1, $2, $3, $4, $5);`,
      [cleanUserId, cleanChallengeId, cleanFlag, Boolean(isCorrect), isCorrect ? 100 : 0]
    ).catch((err) => console.error("recordSubmission DB error:", err));
  }

  return { progress: [], submission };
}

/**
 * Legacy API helper: updateUserXp
 */
export function updateUserXp(userId: string, points: number): UserRecord | null {
  const cleanUserId = sanitizeInput(userId);
  const user: UserRecord = {
    id: cleanUserId,
    email: "operator@cyberlab.local",
    username: "Cyber Operator",
    role: "student",
    xp: Number(points),
    level: Math.floor(Number(points) / 500) + 1,
    title: "Pentest Specialist",
  };

  if (connectionString) {
    // 100% Parameterized query: $1, $2 prevents SQL injection
    pool.query(
      `UPDATE user_progress SET total_score = total_score + $1 WHERE user_id = $2;`,
      [Number(points), cleanUserId]
    ).catch((err) => console.error("updateUserXp DB error:", err));
  }

  return user;
}

/**
 * Legacy API helper: saveCertificate
 */
export function saveCertificate(
  userId: string,
  candidateName: string,
  score: number,
  tasksCompleted: number,
  totalTasks: number
) {
  const cleanUserId = sanitizeInput(userId);
  const cleanName = sanitizeInput(candidateName);
  const certId = "CERT-CYBERLAB-" + Date.now().toString(36).toUpperCase();

  const certificate = {
    id: certId,
    userId: cleanUserId,
    candidateName: cleanName,
    score: Number(score),
    tasksCompleted: Number(tasksCompleted),
    totalTasks: Number(totalTasks),
    issueDate: new Date().toISOString(),
  };

  if (connectionString) {
    // 100% Parameterized query: $1-$5 prevents SQL injection
    pool.query(
      `INSERT INTO quiz_results (user_id, quiz_type, score, max_score, passed) VALUES ($1, $2, $3, $4, $5);`,
      [cleanUserId, "EXAM_CERTIFICATE", Number(score), 1050, Number(score) >= 600]
    ).catch((err) => console.error("saveCertificate DB error:", err));
  }

  return certificate;
}
