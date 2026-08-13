"use client";

import React, { useState } from "react";
import {
  Settings,
  Target,
  Flag,
  Volume2,
  VolumeX,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useCyberLab } from "@/context/CyberLabContext";
import { Modal } from "@/components/ui/Modal";
import { exportProgressAsJson } from "@/lib/storage";

export default function SettingsPage() {
  const { progress, updateSettings, setTargetIp, resetAllProgress, importProgress } =
    useCyberLab();

  const [targetIp, setTargetIpState] = useState(
    progress.targetIps[progress.currentLabId] || progress.settings.defaultTargetIp || "192.168.56.101"
  );
  const [flagPrefix, setFlagPrefix] = useState(progress.settings.flagPrefix || "LAB");
  const [soundEffects, setSoundEffects] = useState(progress.settings.soundEffects);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultTargetIp: targetIp.trim(),
      flagPrefix: flagPrefix.trim().toUpperCase(),
      soundEffects,
    });
    setTargetIp(progress.currentLabId, targetIp.trim());

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportProgressAsJson(progress));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberlab-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError("");
    const success = importProgress(importJson);
    if (success) {
      setIsImportModalOpen(false);
      setImportJson("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      setImportError("Invalid JSON structure. Please verify the backup file format.");
    }
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your local lab network target, flag rules, audio preferences, and data backups.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Lab Target Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Lab Target Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                DEFAULT TARGET IP ADDRESS (METASPLOITABLE 2 / VM)
              </label>
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIpState(e.target.value)}
                placeholder="192.168.56.101"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Set this to the IP address assigned to your Metasploitable 2 VM in VirtualBox/VMware host-only network.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                FLAG PREFIX FORMAT
              </label>
              <input
                type="text"
                value={flagPrefix}
                onChange={(e) => setFlagPrefix(e.target.value)}
                placeholder="LAB"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Default is <code className="text-emerald-400 font-mono">LAB</code> (e.g.{" "}
                <code className="text-emerald-400 font-mono">
                  {flagPrefix || "LAB"}&#123;flag_name&#125;
                </code>
                ).
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Feedback Preferences */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Audio & UI Feedback
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-200">CYBER SOUND EFFECTS</div>
              <p className="text-xs text-slate-400">
                Play synthesized retro cyber audio tones on flag submissions, hints, and success.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSoundEffects(!soundEffects)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEffects
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Save Button with feedback */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Settings saved successfully!
            </span>
          )}
        </div>
      </form>

      {/* Data Backup & Restore */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-purple-400" />
          Data Backup & Transfer
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Export your solved challenges, hint states, and scores to a JSON file to transfer between browsers or machines.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Progress (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import Progress (JSON)</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="rounded-2xl border border-rose-900/50 bg-rose-950/10 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider">Danger Zone</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Resetting all progress will erase all solved challenges, scores, revealed hints, and attempts from your browser&apos;s localStorage. This action cannot be undone.
        </p>

        <div>
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Progress?"
        description="Are you sure you want to reset all completed challenges and scores?"
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
            <p className="font-bold">⚠️ Warning</p>
            <p className="text-rose-400/90 font-sans text-xs">
              All solved flags ({progress.completedChallenges.length} total) and your score of{" "}
              {Object.values(progress.scores).reduce((a, b) => a + b, 0)} XP will be cleared.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>

      {/* Import JSON Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Progress JSON"
        description="Paste your exported CyberLab progress JSON data below"
      >
        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"completedChallenges": [...], "scores": {...}}'
              rows={6}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            {importError && <p className="text-xs text-rose-400 mt-1 font-mono">{importError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              Import Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
