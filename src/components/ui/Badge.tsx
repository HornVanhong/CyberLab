import React from "react";
import { cn } from "@/lib/utils";
import { Difficulty, LabStatus, ChallengeCategory } from "@/types/cyberlab";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "cyan" | "amber" | "rose" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-medium rounded-full",
    md: "text-xs px-3 py-1 font-semibold rounded-md",
    lg: "text-sm px-3.5 py-1.5 font-bold rounded-md",
  };

  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border border-slate-700/60",
    emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    rose: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
    outline: "bg-transparent text-slate-400 border border-slate-700",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 transition-colors", sizeStyles[size], variantStyles[variant], className)}>
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty | string }) {
  if (difficulty === "Easy" || difficulty.toLowerCase().includes("beginner")) {
    return <Badge variant="emerald">● {difficulty}</Badge>;
  }
  if (difficulty === "Medium" || difficulty.toLowerCase().includes("intermediate")) {
    return <Badge variant="amber">● {difficulty}</Badge>;
  }
  return <Badge variant="rose">● {difficulty}</Badge>;
}

export function CategoryBadge({ category }: { category: ChallengeCategory | string }) {
  const colors: Record<string, "cyan" | "purple" | "amber" | "rose" | "emerald" | "default"> = {
    Reconnaissance: "cyan",
    Enumeration: "purple",
    "Vulnerability Analysis": "amber",
    "Initial Access": "rose",
    "Privilege Escalation": "rose",
    Flags: "emerald",
  };

  const variant = colors[category] || "default";
  return <Badge variant={variant}>{category}</Badge>;
}

export function StatusBadge({ status }: { status: LabStatus | string }) {
  if (status === "In Progress" || status === "Active Lab") {
    return (
      <Badge variant="emerald" className="animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        {status}
      </Badge>
    );
  }
  if (status === "Available") {
    return <Badge variant="cyan">{status}</Badge>;
  }
  return <Badge variant="outline">⏳ {status}</Badge>;
}
