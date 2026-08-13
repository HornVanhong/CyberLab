"use client";

import React, { useState } from "react";
import {
  Menu,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Edit2,
  Check,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { Modal } from "@/components/ui/Modal";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { progress, stats, getTargetIp, setTargetIp, updateSettings } = useCyberLab();
  const currentIp = getTargetIp();

  const [isEditIpOpen, setIsEditIpOpen] = useState(false);
  const [ipInput, setIpInput] = useState(currentIp);

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetIp(progress.currentLabId, ipInput);
    setIsEditIpOpen(false);
  };

  const toggleSound = () => {
    updateSettings({ soundEffects: !progress.settings.soundEffects });
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        {/* Left Section: Mobile Menu & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            type="button"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-200 rounded-lg lg:hidden hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">LAB ENVIRONMENT</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">{progress.currentLabId === "metasploitable-2" ? "Metasploitable 2" : progress.currentLabId}</span>
          </div>
        </div>

        {/* Right Section: Target IP, XP Pill, Sound Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Target IP Pill (Click to edit) */}
          <button
            onClick={() => {
              setIpInput(currentIp);
              setIsEditIpOpen(true);
            }}
            type="button"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer group shadow-sm"
            title="Click to configure Target IP"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-spin" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden md:inline">Target:</span>
              <span className="font-semibold text-cyan-300">{currentIp}</span>
            </div>
            <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
          </button>

          {/* Total Score Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{stats.totalScore} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title={progress.settings.soundEffects ? "Mute audio effects" : "Enable audio effects"}
          >
            {progress.settings.soundEffects ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Target IP Edit Modal */}
      <Modal
        isOpen={isEditIpOpen}
        onClose={() => setIsEditIpOpen(false)}
        title="Configure Target IP Address"
        description="Set the local IP address of your Metasploitable 2 or practice VM"
      >
        <form onSubmit={handleSaveIp} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              TARGET IP ADDRESS (VIRTUAL MACHINE)
            </label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.56.101"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              This IP will be displayed across challenge guides and instructions to match your local VM subnet.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditIpOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Check className="w-4 h-4" />
              Save Target IP
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
