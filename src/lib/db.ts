import { Pool } from "pg";

export interface UserRecord {
  id: string;
  email: string;
  display_name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Render PostgreSQL requires SSL connection in production/external connection
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

/**
 * Initialize all database tables for CyberLab
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
 * Execute custom SQL query with params
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

/**
 * Save user profile to database
 */
export async function upsertUser(id: string, email: string, displayName?: string): Promise<UserRecord> {
  const text = `
    INSERT INTO users (id, email, display_name, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const res = await pool.query(text, [id, email, displayName || email.split("@")[0]]);
  return res.rows[0];
}

/**
 * Get user by ID from database
 */
export async function getUserById(id: string): Promise<UserRecord | null> {
  if (!connectionString) return null;
  try {
    const text = `SELECT * FROM users WHERE id = $1;`;
    const res = await pool.query(text, [id]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
}

/**
 * Get user by Email from database
 */
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  if (!connectionString) return null;
  try {
    const text = `SELECT * FROM users WHERE email = $1;`;
    const res = await pool.query(text, [email]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
}

/**
 * Get user progress from database
 */
export async function getUserProgress(userId: string) {
  if (!connectionString) return null;
  const text = `SELECT * FROM user_progress WHERE user_id = $1;`;
  const res = await pool.query(text, [userId]);
  return res.rows[0] || null;
}

/**
 * Save / sync user progress to database
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

  const res = await pool.query(text, [
    userId,
    progressData.currentLabId || "metasploitable-2",
    JSON.stringify(progressData.completedChallenges || []),
    JSON.stringify(progressData.revealedHints || {}),
    JSON.stringify(progressData.scores || {}),
    JSON.stringify(progressData.attempts || {}),
    JSON.stringify(progressData.targetIps || {}),
    JSON.stringify(progressData.settings || {}),
    progressData.lastChallenge || null,
    progressData.totalScore || 0,
  ]);

  return res.rows[0];
}

/**
 * Log a challenge flag attempt to database
 */
export async function logChallengeAttempt(
  userId: string,
  challengeId: string,
  submittedFlag: string,
  isCorrect: boolean,
  pointsEarned: number
) {
  if (!connectionString) return null;
  const text = `
    INSERT INTO challenge_logs (user_id, challenge_id, submitted_flag, is_correct, points_earned)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const res = await pool.query(text, [userId, challengeId, submittedFlag, isCorrect, pointsEarned]);
  return res.rows[0];
}
