"use client";

import { useMemo } from "react";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  driftX: string;
  opacity: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function ParticleField({ count = 40, className }: ParticleFieldProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const r1 = seededRandom(i * 12.9898);
      const r2 = seededRandom(i * 78.233);
      const r3 = seededRandom(i * 37.719);
      const r4 = seededRandom(i * 93.989);

      return {
        id: i,
        left: `${(r1 * 100).toFixed(2)}%`,
        size: Number((1 + r2 * 2.5).toFixed(2)),
        duration: `${(8 + r3 * 14).toFixed(2)}s`,
        delay: `${(-r4 * 20).toFixed(2)}s`,
        driftX: `${((r2 - 0.5) * 80).toFixed(2)}px`,
        opacity: Number((0.25 + r3 * 0.55).toFixed(2)),
      };
    });
  }, [count]);

  return (
    <div className={className} aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={
            {
              left: p.left,
              bottom: "-5%",
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              "--p-drift-x": p.driftX,
              "--p-drift-y": "-120vh",
              "--p-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
