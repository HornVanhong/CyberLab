"use client";

import React, { useState, useMemo } from "react";
import {
  Terminal,
  Search,
  Check,
  Code,
  Shield,
  Sliders,
  BookOpen,
  Wrench,
  Info,
  Download,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Target,
  ExternalLink,
  Layers,
  X,
  Compass,
} from "lucide-react";
import {
  CHEATSHEETS,
  TOOL_BUILDERS,
  CYBER_TOOLS_ENCYCLOPEDIA,
  CommandItem,
  ToolFlagBuilder,
  CyberToolInfo,
} from "@/data/cheatsheets";
import { CopyButton } from "@/components/ui/CopyButton";
import { TerminalBox } from "@/components/ui/TerminalBox";
import { Modal } from "@/components/ui/Modal";

type MainViewMode = "encyclopedia" | "builder" | "cheatsheets";

type ToolCategoryFilter =
  | "All"
  | "Recon & OSINT"
  | "Web Security"
  | "Password Cracking"
  | "Network & Forensics"
  | "Exploitation"
  | "Reverse Engineering";

type CategoryFilter =
  | "All"
  | "OSINT & Info Gathering"
  | "Wireshark & Packet Analysis"
  | "Linux CLI"
  | "Python Cyber"
  | "Network & Recon"
  | "Web Exploitation"
  | "Password Cracking"
  | "Reverse Shells & Exploits";

interface TaskShortcut {
  id: string;
  label: string;
  icon: string;
  toolIds: string[];
}

const TASK_SHORTCUTS: TaskShortcut[] = [
  { id: "all", label: "Show All Tools", icon: "🌐", toolIds: [] },
  { id: "ports", label: "Scan Network Ports", icon: "📡", toolIds: ["nmap", "masscan", "rustscan"] },
  { id: "dirs", label: "Find Web Endpoints", icon: "📁", toolIds: ["gobuster", "ffuf", "dirsearch"] },
  { id: "sqli", label: "Test SQL Injection", icon: "🎯", toolIds: ["sqlmap"] },
  { id: "pass", label: "Crack Passwords", icon: "🔓", toolIds: ["hashcat", "john", "hydra"] },
  { id: "subdomains", label: "Discover Subdomains", icon: "🕵️", toolIds: ["subfinder", "theharvester", "dnsrecon"] },
  { id: "privesc", label: "Privilege Escalation", icon: "🔐", toolIds: ["linpeas", "metasploit", "impacket", "responder"] },
  { id: "sniffing", label: "Inspect Packets & RAM", icon: "🔍", toolIds: ["wireshark", "tcpdump", "volatility"] },
  { id: "reverse", label: "Reverse Engineering", icon: "🔬", toolIds: ["ghidra", "cyberchef"] },
];

const TOOL_CATEGORIES: ToolCategoryFilter[] = [
  "All",
  "Recon & OSINT",
  "Web Security",
  "Password Cracking",
  "Network & Forensics",
  "Exploitation",
  "Reverse Engineering",
];

const CATEGORIES: CategoryFilter[] = [
  "All",
  "OSINT & Info Gathering",
  "Wireshark & Packet Analysis",
  "Linux CLI",
  "Python Cyber",
  "Network & Recon",
  "Web Exploitation",
  "Password Cracking",
  "Reverse Shells & Exploits",
];

export default function CommandsPage() {
  const [activeView, setActiveView] = useState<MainViewMode>("encyclopedia");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategoryFilter>("All");
  const [activeTaskShortcut, setActiveTaskShortcut] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [displayLayout, setDisplayLayout] = useState<"grid" | "list">("grid");

  // Tool Modal Detail state
  const [modalTool, setModalTool] = useState<CyberToolInfo | null>(null);

  // State for interactive builder
  const [selectedBuilderId, setSelectedBuilderId] = useState<string>("nmap");
  const [builderTarget, setBuilderTarget] = useState<string>("");
  const [selectedFlags, setSelectedFlags] = useState<Record<string, boolean>>({});

  // Active expanded tool in inline encyclopedia cards
  const [expandedToolId, setExpandedToolId] = useState<string | null>("nmap");

  // Filtered Tools for Encyclopedia
  const filteredTools = useMemo(() => {
    return CYBER_TOOLS_ENCYCLOPEDIA.filter((tool) => {
      // Task shortcut filter
      const currentTask = TASK_SHORTCUTS.find((t) => t.id === activeTaskShortcut);
      const matchesTask =
        !currentTask || currentTask.id === "all" || currentTask.toolIds.includes(tool.id);

      const matchesCategory =
        selectedToolCategory === "All" || tool.category === selectedToolCategory;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.summary.toLowerCase().includes(query) ||
        tool.usedFor.toLowerCase().includes(query) ||
        tool.keyFlags.some(
          (f) => f.flag.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
        ) ||
        tool.commonUseCases.some(
          (uc) => uc.title.toLowerCase().includes(query) || uc.command.toLowerCase().includes(query)
        );

      return matchesTask && matchesCategory && matchesSearch;
    });
  }, [activeTaskShortcut, selectedToolCategory, searchQuery]);

  // Active builder definition
  const activeBuilder = useMemo(() => {
    return TOOL_BUILDERS.find((b) => b.toolId === selectedBuilderId) || TOOL_BUILDERS[0];
  }, [selectedBuilderId]);

  // Initialize selected flags when builder changes
  React.useEffect(() => {
    if (!activeBuilder) return;
    setBuilderTarget(activeBuilder.targetPlaceholder);
    const initialFlags: Record<string, boolean> = {};
    activeBuilder.options.forEach((opt) => {
      if (opt.defaultChecked) {
        initialFlags[opt.flag] = true;
      }
    });
    setSelectedFlags(initialFlags);
  }, [activeBuilder]);

  // Compute live constructed command
  const generatedCommand = useMemo(() => {
    if (!activeBuilder) return "";
    const activeOpts = activeBuilder.options
      .filter((opt) => selectedFlags[opt.flag])
      .map((opt) => opt.flag)
      .join(" ");

    return `${activeBuilder.baseCommand} ${activeOpts} ${builderTarget}`.trim();
  }, [activeBuilder, selectedFlags, builderTarget]);

  // Filtered Cheatsheet Items
  const filteredItems = useMemo(() => {
    return CHEATSHEETS.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.tool.toLowerCase().includes(query) ||
        item.command.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        (item.flagsBreakdown &&
          item.flagsBreakdown.some(
            (f) => f.flag.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
          ));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFlag = (flag: string) => {
    setSelectedFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const openInBuilder = (toolId: string) => {
    const builderExists = TOOL_BUILDERS.some((b) => b.toolId === toolId);
    if (builderExists) {
      setSelectedBuilderId(toolId);
    } else {
      setSelectedBuilderId("nmap");
    }
    setModalTool(null);
    setActiveView("builder");
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
            <span>ALL CYBERSECURITY TOOLS HUB & KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cyber Tool <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Encyclopedia & Command Generator</span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Explore <strong>all cybersecurity tools</strong> used by security researchers and ethical hackers. Learn what every tool is used for, installation steps, command flags, real-world usage scenarios, and test interactive command generation live.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView("encyclopedia")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "encyclopedia"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Tools Encyclopedia ({CYBER_TOOLS_ENCYCLOPEDIA.length})</span>
            </button>

            <button
              onClick={() => setActiveView("builder")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "builder"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Interactive Command Generator</span>
            </button>

            <button
              onClick={() => setActiveView("cheatsheets")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "cheatsheets"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Command Cheatsheets Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: TOOL ENCYCLOPEDIA & PURPOSE HUB */}
      {activeView === "encyclopedia" && (
        <div className="space-y-6">
          {/* TASK-BASED TOOL RECOMMENDATION ASSISTANT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>What task do you want to accomplish? (Quick Tool Selector)</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {TASK_SHORTCUTS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setActiveTaskShortcut(task.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTaskShortcut === task.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm"
                      : "bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>{task.icon}</span>
                  <span>{task.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Search, Category Filters, and Layout Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tool Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedToolCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedToolCategory === cat
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & Layout Buttons */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[260px] flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any tool (nmap, sqlmap, hydra...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>

              {/* View Layout Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setDisplayLayout("grid")}
                  className={`p-2 rounded-lg text-xs transition-all ${
                    displayLayout === "grid"
                      ? "bg-cyan-500/20 text-cyan-400 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDisplayLayout("list")}
                  className={`p-2 rounded-lg text-xs transition-all ${
                    displayLayout === "list"
                      ? "bg-cyan-500/20 text-cyan-400 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 px-1 flex items-center justify-between">
            <span>Showing {filteredTools.length} cybersecurity tools</span>
            {(searchQuery || activeTaskShortcut !== "all" || selectedToolCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTaskShortcut("all");
                  setSelectedToolCategory("All");
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* GRID LAYOUT */}
          {displayLayout === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTools.map((tool) => {
                const isExpanded = expandedToolId === tool.id;
                return (
                  <div
                    key={tool.id}
                    className={`rounded-2xl border transition-all shadow-xl flex flex-col justify-between overflow-hidden ${
                      isExpanded
                        ? "bg-slate-900/95 border-cyan-500/40 ring-1 ring-cyan-500/20"
                        : "bg-slate-900/70 border-slate-800/90 hover:border-slate-700"
                    }`}
                  >
                    <div className="p-6 space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-cyan-400" />
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

                        <button
                          onClick={() => setModalTool(tool)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap"
                        >
                          Details
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                        {tool.summary}
                      </p>

                      {/* Quick Flag Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                          Key Command Flags
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tool.keyFlags.slice(0, 4).map((f, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded"
                            >
                              {f.flag}
                            </span>
                          ))}
                          {tool.keyFlags.length > 4 && (
                            <span className="text-[10px] font-mono text-slate-500 self-center">
                              +{tool.keyFlags.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setModalTool(tool)}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Learn Purpose & Use Cases</span>
                      </button>

                      <button
                        onClick={() => openInBuilder(tool.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Builder</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST LAYOUT */}
          {displayLayout === "list" && (
            <div className="space-y-3">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => setModalTool(tool)}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-mono">{tool.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {tool.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        [{tool.difficulty}]
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 truncate">{tool.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalTool(tool);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 transition-all"
                    >
                      Learn Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInBuilder(tool.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono hover:bg-emerald-500/30 transition-all"
                    >
                      Builder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No matching cybersecurity tools found</h3>
              <p className="text-xs text-slate-500">
                Try searching for keywords like "nmap", "sqlmap", "wireshark", or "password".
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: INTERACTIVE COMMAND BUILDER */}
      {activeView === "builder" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Interactive Command & Flag Generator</h2>
                <p className="text-xs text-slate-400 font-mono">Toggle flags to build custom terminal execution strings live</p>
              </div>
            </div>

            {/* Builder Tool Selection Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
              {TOOL_BUILDERS.map((builder) => (
                <button
                  key={builder.toolId}
                  onClick={() => setSelectedBuilderId(builder.toolId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    selectedBuilderId === builder.toolId
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  {builder.toolName.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Builder Interactive Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Options Checklist */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span>Select Command Flags & Parameters ({activeBuilder.toolName})</span>
                <span className="text-emerald-400">{Object.values(selectedFlags).filter(Boolean).length} Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {activeBuilder.options.map((option) => {
                  const checked = !!selectedFlags[option.flag];
                  return (
                    <div
                      key={option.flag}
                      onClick={() => toggleFlag(option.flag)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checked
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-sm"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                          checked
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{option.flag}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{option.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight truncate">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Command Output Box */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Target IP / Host / Specifier
                </label>
                <input
                  type="text"
                  value={builderTarget}
                  onChange={(e) => setBuilderTarget(e.target.value)}
                  placeholder={activeBuilder.targetPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Generated Execution Command</span>
                  <span className="text-emerald-400">Ready to execute</span>
                </div>
                <TerminalBox command={generatedCommand || `${activeBuilder.baseCommand} ${builderTarget}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CHEATSHEETS CATALOG */}
      {activeView === "cheatsheets" && (
        <div className="space-y-6">
          {/* Controls: Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands, flags, python..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Showing {filteredItems.length} commands & scripts</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-purple-400 hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            )}
          </div>

          {/* Command Cards Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-sm p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-purple-400 font-mono text-xs font-bold px-2.5 py-1">
                      {item.tool}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <span className="text-[11px] font-mono text-cyan-400">{item.category}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Main Command / Code Box */}
                {item.codeSnippet ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <Code className="w-3.5 h-3.5" /> Python Code Template
                      </span>
                      <span>Runnable Script</span>
                    </div>
                    <TerminalBox command={item.codeSnippet} language="python" />
                  </div>
                ) : (
                  <TerminalBox command={item.command} />
                )}

                {/* Flags Breakdown Explanation (If available) */}
                {item.flagsBreakdown && item.flagsBreakdown.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Flag Parameter Explanations
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.flagsBreakdown.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex items-start gap-2.5"
                        >
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                            {f.flag}
                          </span>
                          <span className="text-slate-300 text-[11px] leading-tight self-center">
                            {f.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No matching commands found</h3>
                <p className="text-xs text-slate-500">
                  Try searching for keywords like "nmap", "privesc", "python", "hashcat", or "gobuster".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL DETAIL MODAL */}
      {modalTool && (
        <Modal
          isOpen={!!modalTool}
          onClose={() => setModalTool(null)}
          title={modalTool.name}
          description={`Tool Category: ${modalTool.category} • Difficulty: ${modalTool.difficulty}`}
          className="max-w-3xl"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Summary & Category Badges */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Overview Summary
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {modalTool.difficulty} Level
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{modalTool.summary}</p>
            </div>

            {/* What is it used for? */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>What is {modalTool.name} Used For?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{modalTool.usedFor}</p>
            </div>

            {/* Installation Command */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Installation Command</span>
              </div>
              <TerminalBox command={modalTool.installCommand} />
            </div>

            {/* Key Command Flags Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Essential Command Flags & Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {modalTool.keyFlags.map((flagObj, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {flagObj.flag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{flagObj.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{flagObj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Use Cases & Commands */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-World Scenarios & Examples</span>
              </div>

              <div className="space-y-3">
                {modalTool.commonUseCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        {useCase.title}
                      </span>
                    </div>

                    <TerminalBox command={useCase.command} />

                    <p className="text-[11px] text-slate-400 italic leading-tight">
                      💡 {useCase.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            {modalTool.proTip && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-mono uppercase text-[11px] block">Pro Tip:</span>
                  <span className="text-slate-300">{modalTool.proTip}</span>
                </div>
              </div>
            )}

            {/* Action Footer inside Modal */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={() => setModalTool(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Close Window
              </button>

              <button
                onClick={() => openInBuilder(modalTool.id)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>Launch in Interactive Builder</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
