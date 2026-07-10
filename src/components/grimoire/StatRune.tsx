"use client";

import { motion } from "framer-motion";

interface StatRuneProps {
  label: string;
  value: number;
  delay?: number;
  color?: string;
}

export function StatRune({ label, value, delay = 0, color = "var(--gold)" }: StatRuneProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="font-display text-[0.55rem] sm:text-[0.65rem] tracking-[0.1em] sm:tracking-[0.15em] uppercase text-[#241a10]/60 w-[5.5rem] sm:w-[7.5rem] shrink-0">
        {label}
      </span>
      <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.span
        className="font-display text-sm w-7 text-right tabular-nums"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
      >
        {value}
      </motion.span>
    </div>
  );
}
