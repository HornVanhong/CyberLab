import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  sublabel?: string;
  variant?: "emerald" | "cyan" | "purple" | "amber" | "rose" | "gradient";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  sublabel,
  variant = "gradient",
  size = "md",
  showValue = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const fillVariants = {
    emerald: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
    cyan: "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]",
    purple: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
    amber: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    rose: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]",
    gradient: "bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-medium flex items-center gap-2">
            {label}
            {sublabel && <span className="text-slate-500 text-[11px]">({sublabel})</span>}
          </span>
          {showValue && <span className="text-emerald-400 font-semibold">{clampedValue}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/80 p-0.5", sizeStyles[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", fillVariants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
