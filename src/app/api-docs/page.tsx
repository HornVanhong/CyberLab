"use client";

import React, { useState } from "react";
import {
  Code,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  FileText,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Play,
  Download,
  BookOpen,
} from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";

interface ApiEndpointDoc {
  id: string;
  category: "Auth & Session" | "Flags & Progress" | "Tools & OSINT" | "Exam & Certs";
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  sampleRequestBody?: string;
  sampleCurlCommand: string;
  expectedResponseSample: string;
}

const API_ENDPOINTS: ApiEndpointDoc[] = [
  {
    id: "auth-me",
    category: "Auth & Session",
    method: "GET",
    path: "/api/auth/me",
    title: "Get Current Session Profile",
    description: "Returns the profile, role, XP, and title of the currently logged-in user or guest session profile.",
    requiresAuth: false,
    sampleCurlCommand: "curl -s http://localhost:3000/api/auth/me",
    expectedResponseSample: JSON.stringify(
      {
        status: "online",
        authenticated: true,
        user: {
          id: "user-student-01",
          username: "student",
          email: "student@cyberlab.local",
          role: "student",
          xp: 450,
          level: 2,
          title: "Security Trainee",
        },
      },
      null,
      2
    ),
  },
  {
    id: "auth-login",
    category: "Auth & Session",
    method: "POST",
    path: "/api/auth/login",
    title: "User Authentication Login",
    description: "Authenticates email and password, issuing a signed HTTP-Only session token cookie (`cyberlab_session`).",
    requiresAuth: false,
    sampleRequestBody: JSON.stringify(
      {
        email: "student@cyberlab.local",
        password: "student123",
      },
      null,
      2
    ),
    sampleCurlCommand:
      'curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"student@cyberlab.local\\",\\"password\\":\\"student123\\"}"',
    expectedResponseSample: JSON.stringify(
      {
        message: "Login successful",
        user: {
          id: "user-student-01",
          username: "student",
          email: "student@cyberlab.local",
          role: "student",
          xp: 450,
        },
        token: "eyJhbGciOiJIUzI1NiI...",
      },
      null,
      2
    ),
  },
  {
    id: "auth-register",
    category: "Auth & Session",
    method: "POST",
    path: "/api/auth/register",
    title: "Register New User Account",
    description: "Creates a new user profile with password hashing and issues a session cookie.",
    requiresAuth: false,
    sampleRequestBody: JSON.stringify(
      {
        username: "hacker99",
        email: "hacker99@cyberlab.local",
        password: "password123",
      },
      null,
      2
    ),
    sampleCurlCommand:
      'curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\\"username\\":\\"hacker99\\",\\"email\\":\\"hacker99@cyberlab.local\\",\\"password\\":\\"password123\\"}"',
    expectedResponseSample: JSON.stringify(
      {
        message: "Registration successful",
        user: { id: "user-99", username: "hacker99", email: "hacker99@cyberlab.local" },
      },
      null,
      2
    ),
  },
  {
    id: "flags-submit",
    category: "Flags & Progress",
    method: "POST",
    path: "/api/flags/submit",
    title: "Submit CTF Challenge Flag",
    description: "Validates submitted CTF flags server-side using SHA-256 hashes, logs submission, and awards XP.",
    requiresAuth: false,
    sampleRequestBody: JSON.stringify(
      {
        labId: "metasploitable-2",
        challengeId: "msf2-01-vsftpd",
        flag: "FLAG{VSFTPD_BACKDOOR_SUCCESS}",
      },
      null,
      2
    ),
    sampleCurlCommand:
      'curl -X POST http://localhost:3000/api/flags/submit -H "Content-Type: application/json" -d "{\\"labId\\":\\"metasploitable-2\\",\\"challengeId\\":\\"msf2-01-vsftpd\\",\\"flag\\":\\"FLAG{VSFTPD_BACKDOOR_SUCCESS}\\"}"',
    expectedResponseSample: JSON.stringify(
      {
        success: true,
        message: "Flag correct! + 100 XP",
        xpEarned: 100,
        challengeId: "msf2-01-vsftpd",
      },
      null,
      2
    ),
  },
  {
    id: "user-progress",
    category: "Flags & Progress",
    method: "GET",
    path: "/api/user/progress",
    title: "Get User Progress & Unlocked Badges",
    description: "Retrieves user progress logs, solved challenge IDs, and current XP score.",
    requiresAuth: false,
    sampleCurlCommand: "curl -s http://localhost:3000/api/user/progress",
    expectedResponseSample: JSON.stringify(
      {
        authenticated: true,
        userId: "user-student-01",
        xp: 450,
        level: 2,
        progress: [
          { challengeId: "msf2-01-vsftpd", solved: true, flagSubmitted: "FLAG{VSFTPD_BACKDOOR_SUCCESS}" },
        ],
      },
      null,
      2
    ),
  },
  {
    id: "tools-execute",
    category: "Tools & OSINT",
    method: "POST",
    path: "/api/tools/execute",
    title: "Execute Security Tool Simulator",
    description: "Server-side tool execution API returning simulated terminal logs for CLI commands.",
    requiresAuth: false,
    sampleRequestBody: JSON.stringify(
      {
        toolId: "nmap",
        command: "nmap -sC -sV 192.168.56.102",
      },
      null,
      2
    ),
    sampleCurlCommand:
      'curl -X POST http://localhost:3000/api/tools/execute -H "Content-Type: application/json" -d "{\\"toolId\\":\\"nmap\\",\\"command\\":\\"nmap -sC -sV 192.168.56.102\\"}"',
    expectedResponseSample: JSON.stringify(
      {
        success: true,
        command: "nmap -sC -sV 192.168.56.102",
        output: "[+] Initializing Nmap execution...\n21/tcp open ftp vsftpd 2.3.4",
      },
      null,
      2
    ),
  },
  {
    id: "exam-submit",
    category: "Exam & Certs",
    method: "POST",
    path: "/api/exam/submit",
    title: "Submit Practical Exam Tasks",
    description: "Grades practical exam tasks server-side and issues a persistent Certificate Record.",
    requiresAuth: false,
    sampleRequestBody: JSON.stringify(
      {
        candidateName: "CyberLab Operator",
        score: 1050,
        tasksCompleted: 6,
        totalTasks: 6,
      },
      null,
      2
    ),
    sampleCurlCommand:
      'curl -X POST http://localhost:3000/api/exam/submit -H "Content-Type: application/json" -d "{\\"candidateName\\":\\"CyberLab Operator\\",\\"score\\":1050,\\"tasksCompleted\\":6,\\"totalTasks\\":6}"',
    expectedResponseSample: JSON.stringify(
      {
        success: true,
        certificate: {
          certificateId: "CYBERLAB-8F92-2026",
          candidateName: "CyberLab Operator",
          score: 1050,
          tasksCompleted: 6,
          issuedAt: "2026-08-13T12:00:00.000Z",
        },
      },
      null,
      2
    ),
  },
];

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [requestBodies, setRequestBodies] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    API_ENDPOINTS.forEach((ep) => {
      if (ep.sampleRequestBody) {
        initial[ep.id] = ep.sampleRequestBody;
      }
    });
    return initial;
  });

  const [testResults, setTestResults] = useState<
    Record<
      string,
      { loading: boolean; status?: number; timeMs?: number; response?: string; error?: string }
    >
  >({});

  const filteredEndpoints = API_ENDPOINTS.filter(
    (ep) => selectedCategory === "All" || ep.category === selectedCategory
  );

  const handleTestEndpoint = async (ep: ApiEndpointDoc) => {
    setTestResults((prev) => ({
      ...prev,
      [ep.id]: { loading: true },
    }));

    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: ep.method,
        headers: { "Content-Type": "application/json" },
      };

      if (ep.method === "POST" && requestBodies[ep.id]) {
        options.body = requestBodies[ep.id];
      }

      const res = await fetch(ep.path, options);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      let data;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      setTestResults((prev) => ({
        ...prev,
        [ep.id]: {
          loading: false,
          status: res.status,
          timeMs,
          response: typeof data === "object" ? JSON.stringify(data, null, 2) : data,
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [ep.id]: {
          loading: false,
          error: err?.message || "Request failed",
        },
      }));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>INTERACTIVE REST API REFERENCE & TESTING PORTAL</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              CyberLab <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">REST API Documentation</span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Explore and test all Next.js 16 full-stack backend API endpoints live. Send requests, inspect JSON schemas, test flag validation, and download the OpenAPI 3.0 specification.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Globe className="w-4 h-4" /> Base URL: http://localhost:3000/api
              </span>
              <span>•</span>
              <a
                href="/api/docs/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export OpenAPI 3.0 Spec (.json)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Auth & Session", "Flags & Progress", "Tools & OSINT", "Exam & Certs"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat} Endpoints
          </button>
        ))}
      </div>

      {/* API Endpoints List */}
      <div className="space-y-6">
        {filteredEndpoints.map((ep) => {
          const resState = testResults[ep.id];
          return (
            <div
              key={ep.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl"
            >
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold border ${
                      ep.method === "GET"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-mono">{ep.path}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ep.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 border border-slate-800 text-[11px] font-mono">
                    {ep.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {ep.description}
              </p>

              {/* Sample Curl Command */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  <span>Terminal cURL Command:</span>
                  <CopyButton text={ep.sampleCurlCommand} />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {ep.sampleCurlCommand}
                </div>
              </div>

              {/* Request Body Input (If POST) */}
              {ep.method === "POST" && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    Request Payload JSON (Editable):
                  </label>
                  <textarea
                    rows={4}
                    value={requestBodies[ep.id] || ""}
                    onChange={(e) => setRequestBodies({ ...requestBodies, [ep.id]: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Test Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleTestEndpoint(ep)}
                  disabled={resState?.loading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {resState?.loading ? (
                    <span>Executing Request...</span>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Send Request / Try It Out</span>
                    </>
                  )}
                </button>

                {resState?.status && (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Status: {resState.status} OK
                    </span>
                    <span className="text-slate-400">{resState.timeMs} ms</span>
                  </div>
                )}
              </div>

              {/* Live Test Response Output */}
              {resState?.response && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold uppercase">
                    <span>Live HTTP Response Body:</span>
                    <CopyButton text={resState.response} />
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-60">
                    {resState.response}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
