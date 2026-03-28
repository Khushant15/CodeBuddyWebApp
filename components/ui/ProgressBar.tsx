"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ progress, className = "h-1.5", color = "bg-blue-500" }: ProgressBarProps) {
  return (
    <div className={`w-full bg-slate-800/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
      />
    </div>
  );
}
