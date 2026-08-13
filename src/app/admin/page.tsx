"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Users,
  Flag,
  Award,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Server,
  Layers,
  Sparkles,
} from "lucide-react";

interface DbStatsResponse {
  success: boolean;
  error?: string;
  summary?: {
    totalUsers: number;
    totalProgressRecords: number;
    totalChallengeLogs: number;
    totalQuizResults: number;
  };
  tables?: {
    users: any[];
    user_progress: any[];
    challenge_logs: any[];
    quiz_results: any[];
  };
}

export default function AdminDatabasePage() {
  const [data, setData] = useState<DbStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"users" | "progress" | "logs" | "quiz">("users");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchDbStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/db/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load database stats.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to database API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbStats();
  }, []);

  // Filter helper
  const filterRows = (rows: any[]) => {
    if (!rows || !Array.isArray(rows)) return [];
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(term)
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>PostgreSQL Database Explorer</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                Render DB
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Live inspection of users, challenge flags, XP scores, and database tables.
            </p>
          </div>
        </div>

        <button
          onClick={fetchDbStats}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold block">Database Connection Notice:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL USERS</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {loading ? "..." : data?.summary?.totalUsers || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SYNCED PROGRESS</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono">
            {loading ? "..." : data?.summary?.totalProgressRecords || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>FLAG SUBMISSIONS</span>
            <Flag className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">
            {loading ? "..." : data?.summary?.totalChallengeLogs || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>EXAM RESULTS</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400 font-mono">
            {loading ? "..." : data?.summary?.totalQuizResults || 0}
          </p>
        </div>
      </div>

      {/* Controls & Table Switcher */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users ({data?.tables?.users?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "progress"
                  ? "bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>User Progress ({data?.tables?.user_progress?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Challenge Logs ({data?.tables?.challenge_logs?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-purple-500 text-slate-950 font-extrabold shadow-lg shadow-purple-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Exam Records ({data?.tables?.quiz_results?.length || 0})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table rows..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        {/* TAB 1: USERS TABLE */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Display Name</th>
                  <th className="py-3 px-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filterRows(data?.tables?.users || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No user records found in PostgreSQL yet.
                    </td>
                  </tr>
                ) : (
                  filterRows(data?.tables?.users || []).map((u, i) => (
                    <tr key={u.id || i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-emerald-400 font-bold max-w-[150px] truncate">{u.id}</td>
                      <td className="py-3 px-4 text-white font-semibold">{u.email}</td>
                      <td className="py-3 px-4 text-slate-300">{u.display_name || "-"}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: USER PROGRESS TABLE */}
        {activeTab === "progress" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Current Lab</th>
                  <th className="py-3 px-4">Completed Challenges</th>
                  <th className="py-3 px-4">Total Score</th>
                  <th className="py-3 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filterRows(data?.tables?.user_progress || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No progress records saved yet.
                    </td>
                  </tr>
                ) : (
                  filterRows(data?.tables?.user_progress || []).map((p, i) => (
                    <tr key={p.user_id || i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-cyan-400 font-bold max-w-[150px] truncate">{p.user_id}</td>
                      <td className="py-3 px-4 text-slate-200">{p.current_lab_id}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          {Array.isArray(p.completed_challenges) ? p.completed_challenges.length : 0} Solved
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{p.total_score || 0} XP</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {p.updated_at ? new Date(p.updated_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: CHALLENGE LOGS TABLE */}
        {activeTab === "logs" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">Submission ID</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Challenge ID</th>
                  <th className="py-3 px-4">Submitted Flag</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filterRows(data?.tables?.challenge_logs || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No challenge flag submission logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  filterRows(data?.tables?.challenge_logs || []).map((l, i) => (
                    <tr key={l.id || i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400">#{l.id}</td>
                      <td className="py-3 px-4 text-amber-400 max-w-[120px] truncate">{l.user_id}</td>
                      <td className="py-3 px-4 font-bold text-white">{l.challenge_id}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-[180px] truncate font-mono">{l.submitted_flag}</td>
                      <td className="py-3 px-4">
                        {l.is_correct ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">+{l.points_earned || 0}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {l.created_at ? new Date(l.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: EXAM / QUIZ RESULTS TABLE */}
        {activeTab === "quiz" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Passed</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filterRows(data?.tables?.quiz_results || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No exam or quiz results stored yet.
                    </td>
                  </tr>
                ) : (
                  filterRows(data?.tables?.quiz_results || []).map((q, i) => (
                    <tr key={q.id || i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400">#{q.id}</td>
                      <td className="py-3 px-4 text-purple-400 max-w-[120px] truncate">{q.user_id}</td>
                      <td className="py-3 px-4 font-bold text-white">{q.quiz_type}</td>
                      <td className="py-3 px-4 text-amber-400 font-bold">{q.score} / {q.max_score}</td>
                      <td className="py-3 px-4">
                        {q.passed ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Passed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Failed</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {q.created_at ? new Date(q.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
