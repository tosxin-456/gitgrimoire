"use client";

import { RuneCircle } from "./RuneCircle";

interface MagicCircleBackdropProps {
  size?: number;
  className?: string;
}

export function MagicCircleBackdrop({ size = 640, className }: MagicCircleBackdropProps) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        className="rune-ring-pulse"
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(107,63,174,0.35), transparent 70%)",
        }}
      />
      <RuneCircle size={size} className="rune-ring-slow absolute" color="var(--gold)" opacity={0.5} />
      <RuneCircle size={size * 0.72} className="rune-ring-medium absolute" color="var(--arcane-purple)" opacity={0.55} />
    </div>
  );
}
