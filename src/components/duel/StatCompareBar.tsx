"use client";

import { motion } from "framer-motion";

interface StatCompareBarProps {
  label: string;
  a: number;
  b: number;
  max?: number;
  colorA: string;
  colorB: string;
  delay?: number;
}

/** Two bars growing outward from a centered label — a versus-screen stat row. */
export function StatCompareBar({ label, a, b, max = 99, colorA, colorB, delay = 0 }: StatCompareBarProps) {
  const pctA = Math.min(100, (a / max) * 100);
  const pctB = Math.min(100, (b / max) * 100);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="w-8 text-right font-display text-sm tabular-nums shrink-0" style={{ color: colorA }}>
        {a}
      </span>
      <div className="flex-1 flex items-center h-2.5 sm:h-3">
        <div className="flex-1 flex justify-end h-full rounded-l-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-l-full"
            style={{ background: colorA }}
            initial={{ width: 0 }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="px-2 font-display text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em] uppercase text-foreground-muted shrink-0 w-16 sm:w-24 text-center">
          {label}
        </span>
        <div className="flex-1 h-full rounded-r-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-r-full ml-auto"
            style={{ background: colorB }}
            initial={{ width: 0 }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
      <span className="w-8 text-left font-display text-sm tabular-nums shrink-0" style={{ color: colorB }}>
        {b}
      </span>
    </div>
  );
}
