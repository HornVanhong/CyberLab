"use client";

import React from "react";
import { Terminal, Check } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

interface TerminalBoxProps {
  command: string;
  explanation?: string;
  label?: string;
  output?: string;
  language?: string;
  className?: string;
}

export function TerminalBox({ command, explanation, label, output, language, className }: TerminalBoxProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-slate-800 bg-slate-950/90 shadow-lg text-xs font-mono group transition-all hover:border-slate-700",
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] text-slate-400 font-sans font-medium flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            {label || "kali@cyberlab:~"}
          </span>
        </div>
        <CopyButton text={command} />
      </div>

      {/* Terminal Body */}
      <div className="p-3 space-y-2 select-text">
        <div className="flex items-start gap-2 text-slate-200">
          <span className="text-emerald-400 font-bold select-none">$</span>
          <code className="text-emerald-300 font-semibold break-all">{command}</code>
        </div>

        {explanation && (
          <p className="text-[11px] text-slate-400 font-sans border-t border-slate-900/80 pt-2 leading-relaxed">
            💡 {explanation}
          </p>
        )}

        {output && (
          <div className="mt-2 pt-2 border-t border-slate-900 text-slate-400 whitespace-pre-wrap font-mono text-[11px] bg-slate-950 p-2 rounded">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
