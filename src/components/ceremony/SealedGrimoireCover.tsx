"use client";

import { motion } from "framer-motion";
import { RuneCircle } from "@/components/visual/RuneCircle";

interface SealedGrimoireCoverProps {
  turningPages?: boolean;
}

/** The mystery cover shown before the profile has been analyzed — no rarity or attribute revealed yet. */
export function SealedGrimoireCover({ turningPages = false }: SealedGrimoireCoverProps) {
  return (
    <div
      className="relative w-full h-full rounded-r-xl rounded-l-sm overflow-hidden"
      style={{
        background: "linear-gradient(155deg, #241a3d 0%, #0b0810 55%, #241a3d 130%)",
        boxShadow:
          "inset 0 0 0 1px rgba(232,196,104,0.35), inset 0 0 50px rgba(107,63,174,0.35), 0 30px 80px rgba(0,0,0,0.7)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-4"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.6), transparent)" }}
      />
      <div className="absolute inset-3 rounded-r-lg rounded-l-sm pointer-events-none" style={{ boxShadow: "inset 0 0 0 1.5px rgba(232,196,104,0.4)" }} />

      <div className="absolute inset-0 flex items-center justify-center">
        <RuneCircle size={300} className="rune-ring-slow" color="var(--gold)" opacity={0.5} />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, rgba(232,196,104,0.35), transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="var(--gold-bright)" strokeWidth={1.2}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </motion.div>
      </div>

      {turningPages && (
        <div className="absolute inset-0 pointer-events-none perspective-1600">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-0 right-0 h-full w-1/2 origin-left"
              style={{
                background: "linear-gradient(120deg, #efe6d0, #d8caa0)",
                boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              }}
              initial={{ rotateY: 0, opacity: 0 }}
              animate={{ rotateY: [-10, -170], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.55, delay: i * 0.28, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
