"use client";

import React, { useState, useMemo } from "react";
import {
  Wrench,
  Search,
  BookOpen,
  Check,
  Code,
  Shield,
  Sliders,
  Download,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Zap,
  Terminal,
  Play,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
  X,
  Compass,
} from "lucide-react";
import { DETAILED_TOOLS, DetailedCyberTool, FlagExplanation } from "@/data/toolsData";
import { CopyButton } from "@/components/ui/CopyButton";
import { TerminalBox } from "@/components/ui/TerminalBox";
import { Modal } from "@/components/ui/Modal";

type ToolCategoryFilter =
  | "All"
  | "Recon & OSINT"
  | "Web Security"
  | "Password Cracking"
  | "Network & Forensics"
  | "Exploitation"
  | "Reverse Engineering";

type DifficultyFilter = "All" | "Beginner" | "Intermediate" | "Advanced";

export default function LearnToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryFilter>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>("All");

  // Selected tool for the interactive learning modal
  const [activeTool, setActiveTool] = useState<DetailedCyberTool | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "flags" | "tutorial" | "practice" | "tips">("overview");

  // Interactive Flag Builder state inside modal
  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({});
  const [customTargetInput, setCustomTargetInput] = useState("192.168.1.50");

  // Terminal Simulator state inside modal
  const [simulatedCommand, setSimulatedCommand] = useState("");
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize flags when active tool opens
  const openToolLesson = (tool: DetailedCyberTool) => {
    setActiveTool(tool);
    setModalTab("overview");
    setCustomTargetInput("192.168.1.50");
    const initialFlags: Record<string, boolean> = {};
    tool.flags.slice(0, 2).forEach((f) => {
      initialFlags[f.flag] = true;
    });
    setActiveFlags(initialFlags);
    setSimulatedCommand("");
    setSimulatedOutput(null);
  };

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return DETAILED_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || tool.difficulty === selectedDifficulty;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.summary.toLowerCase().includes(query) ||
        tool.whatIsIt.toLowerCase().includes(query) ||
        tool.whenToUse.toLowerCase().includes(query) ||
        tool.flags.some((f) => f.flag.toLowerCase().includes(query) || f.label.toLowerCase().includes(query));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Compute Live Flag Builder Command inside modal
  const liveConstructedCommand = useMemo(() => {
    if (!activeTool) return "";
    const selectedFlagStrings = activeTool.flags
      .filter((f) => activeFlags[f.flag])
      .map((f) => f.flag)
      .join(" ");

    const baseName = activeTool.id === "gobuster" ? "gobuster dir -u" : activeTool.id === "sqlmap" ? "sqlmap -u" : activeTool.id;
    return `${baseName} ${selectedFlagStrings} ${customTargetInput}`.trim();
  }, [activeTool, activeFlags, customTargetInput]);

  const toggleModalFlag = (flag: string) => {
    setActiveFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const runSimulatedCommand = (cmdToRun?: string) => {
    const cmd = cmdToRun || simulatedCommand || liveConstructedCommand;
    if (!cmd || !activeTool) return;

    setIsSimulating(true);
    setSimulatedOutput(null);

    setTimeout(() => {
      setIsSimulating(false);

      // Match step command outputs
      const matchedStep = activeTool.tutorialSteps.find(
        (step) => step.command && cmd.toLowerCase().includes(step.command.toLowerCase().split(" ")[0])
      );

      if (matchedStep && matchedStep.expectedOutputSnippet) {
        setSimulatedOutput(matchedStep.expectedOutputSnippet);
      } else {
        setSimulatedOutput(
          `[+] Executing command: ${cmd}\n[+] Connected to target environment.\n[+] Task completed successfully!\n[+] Status: 200 OK (0.014s latency)`
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Wrench className="w-3.5 h-3.5" />
            <span>CYBERSECURITY TOOL TUTORIAL ACADEMY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">All Cybersecurity Tools</span> Step-by-Step
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Master **Nmap**, **Gobuster**, **SQLmap**, **Hydra**, **Wireshark**, **Metasploit**, **Ghidra**, and more. Learn installation, syntax patterns, flag parameters, real-world usage scenarios, and test commands in our terminal simulator.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> {DETAILED_TOOLS.length} Interactive Lessons
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Zap className="w-4 h-4" /> Interactive Terminal Simulator
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search, Category Filters, & Difficulty */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {(
              [
                "All",
                "Recon & OSINT",
                "Web Security",
                "Password Cracking",
                "Network & Forensics",
                "Exploitation",
                "Reverse Engineering",
              ] as ToolCategoryFilter[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Difficulty Selector */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any tool (nmap, gobuster...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyFilter)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Showing {filteredTools.length} tool tutorials</span>
          {(searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-sm p-6 space-y-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {tool.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        tool.difficulty === "Beginner"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : tool.difficulty === "Intermediate"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {tool.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                {tool.summary}
              </p>

              {/* Syntax Pattern Box */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                  Command Syntax Pattern
                </span>
                <code className="text-xs font-mono text-emerald-400 truncate block">
                  {tool.syntaxPattern}
                </code>
              </div>

              {/* Competitors Badges */}
              {tool.competingTools.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span>Similar:</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.competingTools.map((comp) => (
                      <span key={comp} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px]">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => openToolLesson(tool)}
              className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Interactive Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No matching tool tutorials found</h3>
          <p className="text-xs text-slate-500">
            Try searching for terms like "nmap", "sqlmap", "wireshark", or "hashcat".
          </p>
        </div>
      )}

      {/* INTERACTIVE TOOL LESSON MODAL */}
      {activeTool && (
        <Modal
          isOpen={!!activeTool}
          onClose={() => setActiveTool(null)}
          title={`Master ${activeTool.name}`}
          description={`Category: ${activeTool.category} • Level: ${activeTool.difficulty}`}
          className="max-w-4xl"
        >
          <div className="space-y-6 max-h-[78vh] overflow-y-auto pr-1">
            {/* Modal Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setModalTab("overview")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  modalTab === "overview"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Overview & Purpose</span>
              </button>

              <button
                onClick={() => setModalTab("flags")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  modalTab === "flags"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Flags Masterclass</span>
              </button>

              <button
                onClick={() => setModalTab("tutorial")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  modalTab === "tutorial"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>3. Step-by-Step Tutorial</span>
              </button>

              <button
                onClick={() => setModalTab("practice")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  modalTab === "practice"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>4. Terminal Simulator</span>
              </button>

              <button
                onClick={() => setModalTab("tips")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  modalTab === "tips"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>5. Pro Tips</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & PURPOSE */}
            {modalTab === "overview" && (
              <div className="space-y-6 animate-fadeIn">
                {/* What Is It */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>What is {activeTool.name}?</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeTool.whatIsIt}</p>
                </div>

                {/* When To Use */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>When should you use this tool?</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeTool.whenToUse}</p>
                </div>

                {/* Installation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Installation Command</span>
                  </div>
                  <TerminalBox command={activeTool.installCommand} />
                </div>

                {/* Syntax Pattern */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Base Command Syntax Pattern</span>
                  </div>
                  <TerminalBox command={activeTool.syntaxPattern} />
                </div>
              </div>
            )}

            {/* TAB 2: FLAGS MASTERCLASS */}
            {modalTab === "flags" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Interactive Flag Selection */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-white uppercase">Interactive Flag Command Constructor</span>
                    <span className="text-cyan-400">Toggle checkboxes below</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {activeTool.flags.map((f) => {
                      const checked = !!activeFlags[f.flag];
                      return (
                        <div
                          key={f.flag}
                          onClick={() => toggleModalFlag(f.flag)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            checked
                              ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                              checked
                                ? "bg-cyan-500 border-cyan-400 text-slate-950"
                                : "border-slate-700 bg-slate-900"
                            }`}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono">{f.flag}</span>
                              <span className="text-[10px] text-slate-400">{f.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">{f.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Target Input */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-mono text-slate-400">Target Specifier Input:</label>
                    <input
                      type="text"
                      value={customTargetInput}
                      onChange={(e) => setCustomTargetInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Live Constructed Output */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Live Constructed Command</span>
                      <button
                        onClick={() => runSimulatedCommand(liveConstructedCommand)}
                        className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Run in Simulator
                      </button>
                    </div>
                    <TerminalBox command={liveConstructedCommand} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STEP-BY-STEP TUTORIAL */}
            {modalTab === "tutorial" && (
              <div className="space-y-6 animate-fadeIn">
                {activeTool.tutorialSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-mono flex items-center justify-center font-bold">
                          {step.stepNumber}
                        </span>
                        {step.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{step.explanation}</p>

                    {step.command && <TerminalBox command={step.command} />}

                    {step.expectedOutputSnippet && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                          Expected Terminal Output
                        </span>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                          {step.expectedOutputSnippet}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: TERMINAL SIMULATOR */}
            {modalTab === "practice" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-white uppercase flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Interactive Terminal Command Simulator
                    </span>
                    <span className="text-emerald-400">Type or select command</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-400">Terminal Input Command:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={simulatedCommand || liveConstructedCommand}
                        onChange={(e) => setSimulatedCommand(e.target.value)}
                        placeholder={`e.g. ${activeTool.syntaxPattern}`}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        onClick={() => runSimulatedCommand()}
                        disabled={isSimulating}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        {isSimulating ? (
                          <span>Executing...</span>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Test Run</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Simulated Terminal Screen */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs min-h-[160px]">
                    <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-800/80 text-[11px]">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-slate-400">cyberlab@kali:~# {simulatedCommand || liveConstructedCommand}</span>
                    </div>

                    {isSimulating ? (
                      <div className="text-cyan-400 flex items-center gap-2 py-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                        <span>Sending raw packets to target host...</span>
                      </div>
                    ) : simulatedOutput ? (
                      <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed py-1">
                        {simulatedOutput}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic py-4">
                        Press "Test Run" above to simulate command execution and view live terminal output.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PRO TIPS */}
            {modalTab === "tips" && (
              <div className="space-y-4 animate-fadeIn">
                {activeTool.proTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3"
                  >
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold font-mono uppercase text-xs text-amber-300 block">Pro Tip #{idx + 1}:</span>
                      <span className="text-slate-300 leading-relaxed">{tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Action Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={() => setActiveTool(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Close Lesson
              </button>

              <button
                onClick={() => setModalTab("practice")}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Test in Simulator</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
