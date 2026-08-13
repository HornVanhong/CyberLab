"use client";

import React, { useState } from "react";
import {
  Server,
  Download,
  Terminal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe,
  Radio,
  ExternalLink,
  Copy,
} from "lucide-react";
import { LAB_SETUP_SECTIONS, SetupGuideSection, SetupStep } from "@/data/setupGuideData";
import { TerminalBox } from "@/components/ui/TerminalBox";

export default function SetupGuidePage() {
  const [activeSectionId, setActiveSectionId] = useState<string>("kali-vm");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [expandedTroubleshoot, setExpandedTroubleshoot] = useState<Record<number, boolean>>({});

  const activeSection = LAB_SETUP_SECTIONS.find((s) => s.id === activeSectionId) || LAB_SETUP_SECTIONS[0];

  const toggleStepComplete = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const toggleTroubleshoot = (idx: number) => {
    setExpandedTroubleshoot((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Server className="w-3.5 h-3.5" />
            <span>LOCAL VIRTUAL CYBER LAB SETUP ACADEMY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How to Set Up <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Kali VM & Metasploitable</span> Step-by-Step
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Follow our step-by-step guides to install **Kali Linux VM**, set up the intentionally vulnerable **Metasploitable target VM**, and configure isolated **Host-Only virtual networks** for safe ethical hacking practice.
          </p>

          {/* Section Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {LAB_SETUP_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSectionId === sec.id
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {sec.id === "kali-vm" && <Shield className="w-4 h-4" />}
                {sec.id === "metasploitable" && <Server className="w-4 h-4" />}
                {sec.id === "network-config" && <Radio className="w-4 h-4" />}
                <span>{sec.title.split(" ")[0]} {sec.title.split(" ")[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements & Network Topology (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prerequisites Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Hardware & Software Requirements</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {activeSection.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Virtual Network Topology Visualizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Radio className="w-4 h-4" />
              <span>Isolated Lab Network Topology</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>🐉 Kali Linux VM (Attacker)</span>
                  <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">vboxnet0</span>
                </div>
                <p className="text-[11px] text-slate-400">Host-Only IP: 192.168.56.101</p>
              </div>

              <div className="text-center text-emerald-400 font-bold text-[11px]">
                ↕️ VirtualBox Host-Only Switch (192.168.56.0/24) ↕️
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>🎯 Metasploitable VM (Target)</span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">vboxnet0</span>
                </div>
                <p className="text-[11px] text-slate-400">Host-Only IP: 192.168.56.102</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              🔒 Host-Only networking isolates target VMs from the public internet while allowing Kali Linux to communicate directly with Metasploitable.
            </p>
          </div>
        </div>

        {/* Right Column: Step-by-Step Installation Guide (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-white">{activeSection.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeSection.subtitle}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 self-start sm:self-center">
                Step-by-Step Guide
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              {activeSection.summary}
            </p>

            {/* Steps Sequence */}
            <div className="space-y-6">
              {activeSection.steps.map((step) => {
                const stepKey = `${activeSection.id}-step-${step.stepNumber}`;
                const isChecked = !!completedSteps[stepKey];
                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isChecked
                        ? "bg-slate-950/60 border-emerald-500/40"
                        : "bg-slate-950/90 border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-sm font-mono font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h3 className="text-base font-bold text-white">{step.title}</h3>
                      </div>

                      <button
                        onClick={() => toggleStepComplete(stepKey)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                          </>
                        ) : (
                          "Mark Done"
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-11 font-sans">
                      {step.description}
                    </p>

                    {step.command && (
                      <div className="pl-11">
                        <TerminalBox command={step.command} />
                      </div>
                    )}

                    {step.note && (
                      <div className="ml-11 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>💡 {step.note}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Troubleshooting Section */}
            {activeSection.troubleshootingTips.length > 0 && (
              <div className="pt-4 space-y-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Common Setup Errors & Troubleshooting</span>
                </div>

                <div className="space-y-3">
                  {activeSection.troubleshootingTips.map((item, idx) => {
                    const isExpanded = !!expandedTroubleshoot[idx];
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden"
                      >
                        <div
                          onClick={() => toggleTroubleshoot(idx)}
                          className="p-4 cursor-pointer flex items-center justify-between gap-3 text-xs font-bold text-amber-200 select-none hover:bg-slate-900/60"
                        >
                          <span className="flex items-center gap-2">
                            <span>❓ {item.issue}</span>
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                            <p>{item.solution}</p>
                            {item.command && <TerminalBox command={item.command} />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
