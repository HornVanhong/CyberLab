"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  RotateCcw,
  Check,
  Download,
  Flame,
  Wrench,
  Search,
  Code,
  FileText,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { PRACTICAL_EXAM_TASKS, ExamTask } from "@/data/examData";
import { TerminalBox } from "@/components/ui/TerminalBox";
import { Modal } from "@/components/ui/Modal";
import { playSound } from "@/lib/sound";

export default function PracticalExamPage() {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [solvedTasks, setSolvedTasks] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});

  // Terminal Simulator State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Timer State (45 minutes = 2700s)
  const [timeRemaining, setTimeRemaining] = useState(2700);
  const [isExamActive, setIsExamActive] = useState(true);

  // Certificate Modal
  const [showCertificate, setShowCertificate] = useState(false);

  const activeTask = PRACTICAL_EXAM_TASKS[activeTaskIndex];

  // Timer Countdown
  useEffect(() => {
    if (!isExamActive || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Total Score & Completion
  const totalScore = useMemo(() => {
    return Object.keys(solvedTasks).reduce((acc, taskId) => {
      const task = PRACTICAL_EXAM_TASKS.find((t) => t.id === taskId);
      const hintPenalty = revealedHints[taskId] ? 10 : 0;
      return acc + (task ? task.xpReward - hintPenalty : 0);
    }, 0);
  }, [solvedTasks, revealedHints]);

  const solvedCount = Object.keys(solvedTasks).length;
  const isAllSolved = solvedCount === PRACTICAL_EXAM_TASKS.length;

  // Handle Answer Submission
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = userAnswers[activeTask.id]?.trim() || "";
    if (!currentInput) return;

    const isCorrect = activeTask.correctAnswers.some(
      (ans) => ans.toLowerCase() === currentInput.toLowerCase()
    );

    if (isCorrect) {
      playSound("success");
      setSolvedTasks((prev) => ({ ...prev, [activeTask.id]: true }));
      setTaskFeedback((prev) => ({
        ...prev,
        [activeTask.id]: { success: true, msg: "Correct Flag / Answer! + " + activeTask.xpReward + " XP" },
      }));
    } else {
      playSound("error");
      setTaskFeedback((prev) => ({
        ...prev,
        [activeTask.id]: { success: false, msg: "Incorrect answer. Check the OSINT command output and try again." },
      }));
    }
  };

  // Run Terminal Command on Kali VM Simulator
  const runKaliCommand = (customCmd?: string) => {
    const cmdToRun = customCmd || terminalInput || activeTask.suggestedTerminalCommand;
    if (!cmdToRun) return;

    setIsExecuting(true);
    setTerminalOutput(null);

    setTimeout(() => {
      setIsExecuting(false);

      // Match active task output or generic execution
      if (cmdToRun.toLowerCase().includes(activeTask.suggestedTerminalCommand.split(" ")[0].toLowerCase())) {
        setTerminalOutput(activeTask.simulatedTerminalOutput);
      } else {
        setTerminalOutput(
          `cyberlab@kali:~# ${cmdToRun}\n[+] Connection established with target node.\n[+] Command output:\n${activeTask.simulatedTerminalOutput}`
        );
      }
    }, 500);
  };

  const revealTaskHint = (taskId: string) => {
    setRevealedHints((prev) => ({ ...prev, [taskId]: true }));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>PRACTICAL OSINT & KALI VM CERTIFICATION EXAM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Practical Cyber & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-400">OSINT Operator Exam</span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Execute OSINT search queries (<strong>Shodan</strong>, <strong>Crt.sh</strong>, <strong>Google Dorks</strong>) and Kali Linux VM terminal commands to solve real scenarios and complete the certification exam.
            </p>
          </div>

          {/* Exam Status Badge & Timer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shrink-0 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="w-4 h-4" /> Time Left:
              </span>
              <span className="font-bold text-white text-sm font-mono">{formatTime(timeRemaining)}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>Exam Progress:</span>
              <span className="text-emerald-400 font-bold">{solvedCount} / {PRACTICAL_EXAM_TASKS.length} Tasks</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Score Earned:</span>
              <span className="text-amber-400 font-bold">{totalScore} XP</span>
            </div>

            {isAllSolved && (
              <button
                onClick={() => setShowCertificate(true)}
                className="w-full mt-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Claim Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Exam Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task Navigation List (3 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between px-1">
            <span>Exam Tasks ({PRACTICAL_EXAM_TASKS.length})</span>
            <span className="text-amber-400">{Math.round((solvedCount / PRACTICAL_EXAM_TASKS.length) * 100)}% Complete</span>
          </div>

          <div className="space-y-2.5">
            {PRACTICAL_EXAM_TASKS.map((task, idx) => {
              const isSolved = !!solvedTasks[task.id];
              const isActive = idx === activeTaskIndex;
              return (
                <div
                  key={task.id}
                  onClick={() => setActiveTaskIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isActive
                      ? "bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-lg text-xs font-mono font-bold shrink-0 ${
                      isSolved
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : isActive
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-slate-950 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {isSolved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : task.taskNumber}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{task.title}</span>
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">+{task.xpReward} XP</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block">{task.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Task Workspace & Kali Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Task Card & Answer Submission */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-sm font-bold flex items-center justify-center">
                  #{activeTask.taskNumber}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">{activeTask.title}</h2>
                  <span className="text-xs font-mono text-cyan-400">{activeTask.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 text-amber-400 border border-slate-800">
                  Tool: {activeTask.osintToolRecommended}
                </span>
              </div>
            </div>

            {/* Scenario Description */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Exam Task Scenario</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                {activeTask.scenarioDescription}
              </p>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <label className="font-semibold text-white uppercase">Submit Answer / Flag:</label>
                {solvedTasks[activeTask.id] ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved (+{activeTask.xpReward} XP)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => revealTaskHint(activeTask.id)}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Need Hint? (-10 XP)
                  </button>
                )}
              </div>

              {revealedHints[activeTask.id] && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono">
                  💡 Hint: {activeTask.hint}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={userAnswers[activeTask.id] || ""}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [activeTask.id]: e.target.value })}
                  placeholder="Enter answer (e.g. vsFTPd 2.3.4 or flag string)..."
                  disabled={solvedTasks[activeTask.id]}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400 disabled:opacity-60"
                />

                {!solvedTasks[activeTask.id] && (
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Feedback Message */}
              {taskFeedback[activeTask.id] && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    taskFeedback[activeTask.id].success
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                  }`}
                >
                  {taskFeedback[activeTask.id].success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{taskFeedback[activeTask.id].msg}</span>
                </div>
              )}

              {/* Solution Walkthrough when Solved */}
              {solvedTasks[activeTask.id] && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-2 mt-4">
                  <span className="font-bold font-mono text-emerald-400 uppercase tracking-wider block">
                    ✓ Official Solution Walkthrough:
                  </span>
                  <p className="leading-relaxed">{activeTask.solutionWalkthrough}</p>
                </div>
              )}
            </form>
          </div>

          {/* EMBEDDED INTERACTIVE KALI VM TERMINAL & OSINT HELPER */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  Interactive Kali Linux VM & OSINT Console
                </h3>
              </div>

              <button
                onClick={() => runKaliCommand(activeTask.suggestedTerminalCommand)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Run Task Command</span>
              </button>
            </div>

            {/* Quick OSINT Helper Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => runKaliCommand("shodan host 198.51.100.42")}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono hover:border-cyan-400 transition-all whitespace-nowrap cursor-pointer"
              >
                ⚡ Shodan Search
              </button>
              <button
                onClick={() => runKaliCommand("curl -s https://crt.sh/?q=%.cyberlab-corp.lab")}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono hover:border-cyan-400 transition-all whitespace-nowrap cursor-pointer"
              >
                ⚡ Crt.sh Subdomains
              </button>
              <button
                onClick={() => runKaliCommand("hashcat -m 0 5f4dcc3b5aa765d61d8327deb882cf99 rockyou.txt")}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono hover:border-cyan-400 transition-all whitespace-nowrap cursor-pointer"
              >
                ⚡ Hashcat Decoder
              </button>
              <button
                onClick={() => runKaliCommand("curl -s http://target.lab/.env")}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono hover:border-cyan-400 transition-all whitespace-nowrap cursor-pointer"
              >
                ⚡ Read Leaked .env
              </button>
            </div>

            {/* Command Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder={`e.g. ${activeTask.suggestedTerminalCommand}`}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
              />

              <button
                onClick={() => runKaliCommand()}
                disabled={isExecuting}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {isExecuting ? (
                  <span>Running...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Kali Command</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Screen Output */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs min-h-[180px]">
              <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-800/80 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400">cyberlab@kali:~# {terminalInput || activeTask.suggestedTerminalCommand}</span>
              </div>

              {isExecuting ? (
                <div className="text-cyan-400 flex items-center gap-2 py-6">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  <span>Executing command on Kali VM environment...</span>
                </div>
              ) : terminalOutput ? (
                <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed py-1">
                  {terminalOutput}
                </div>
              ) : (
                <div className="text-slate-500 italic py-6">
                  Click "Auto-Run Task Command" or "Run Kali Command" above to execute terminal commands and inspect target output.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OFFICIAL EXAM CERTIFICATE OF COMPLETION MODAL */}
      <Modal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        title="Official Certificate of Completion"
        className="max-w-2xl"
      >
        <div className="space-y-6 text-center py-4">
          <div className="p-8 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-48 h-48 text-amber-400" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                <Shield className="w-3.5 h-3.5" /> CERTIFIED CYBERLAB OPERATOR
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Practical OSINT & Cyber Operator Certificate
              </h2>
              <p className="text-xs text-slate-400 font-mono">Certificate ID: CYBERLAB-EXAM-2026-9901</p>
            </div>

            <div className="py-4 border-y border-slate-800 space-y-2">
              <p className="text-xs text-slate-300">This certifies that the candidate has successfully passed the</p>
              <h3 className="text-lg font-bold text-amber-400">Practical OSINT & Kali Linux Examination</h3>
              <p className="text-xs text-emerald-400 font-mono font-bold">
                Final Score: {totalScore} XP ({solvedCount} / {PRACTICAL_EXAM_TASKS.length} Tasks Solved)
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span>Issued by CyberLab Platform</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Certificate PDF</span>
            </button>

            <button
              onClick={() => setShowCertificate(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
