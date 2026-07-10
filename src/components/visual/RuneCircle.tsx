"use client";

interface RuneCircleProps {
  size?: number;
  className?: string;
  color?: string;
  opacity?: number;
}

/**
 * An original, abstract magic-circle glyph (tick marks + generated rune
 * strokes + nested rings) — not a reproduction of any copyrighted artwork.
 */

// Trig functions can differ by a single ULP between Node (SSR) and the
// browser (CSR), which trips React's hydration mismatch check. Rounding
// every derived coordinate collapses those differences.
function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function generateRuneGlyphs(ringRadius: number, glyphCount: number, seedOffset: number) {
  const glyphs = [];
  for (let i = 0; i < glyphCount; i++) {
    const angle = (i / glyphCount) * Math.PI * 2;
    const cx = round(200 + ringRadius * Math.cos(angle));
    const cy = round(200 + ringRadius * Math.sin(angle));
    const seed = (i + seedOffset) * 13.37;
    const variant = Math.floor(Math.abs(Math.sin(seed)) * 4);
    const rotation = round((angle * 180) / Math.PI + 90);
    glyphs.push({ cx, cy, variant, rotation, key: `${ringRadius}-${i}` });
  }
  return glyphs;
}

function RuneGlyph({ variant, x, y, rotation }: { variant: number; x: number; y: number; rotation: number }) {
  const transform = `translate(${x} ${y}) rotate(${rotation})`;
  switch (variant) {
    case 0:
      return (
        <g transform={transform}>
          <line x1="0" y1="-6" x2="0" y2="6" />
          <line x1="-4" y1="-3" x2="4" y2="-3" />
        </g>
      );
    case 1:
      return (
        <g transform={transform}>
          <circle r="3.2" cx="0" cy="0" fill="none" />
          <line x1="0" y1="-6" x2="0" y2="-3.2" />
        </g>
      );
    case 2:
      return (
        <g transform={transform}>
          <path d="M -4 5 L 0 -6 L 4 5 Z" fill="none" />
        </g>
      );
    default:
      return (
        <g transform={transform}>
          <line x1="-5" y1="0" x2="5" y2="0" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
        </g>
      );
  }
}

export function RuneCircle({ size = 400, className, color = "var(--gold)", opacity = 0.6 }: RuneCircleProps) {
  const outerGlyphs = generateRuneGlyphs(178, 24, 0);
  const innerGlyphs = generateRuneGlyphs(132, 16, 7);
  const tickCount = 60;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className={className}
      style={{ color, opacity }}
      stroke="currentColor"
      fill="none"
      strokeWidth={1}
      aria-hidden
    >
      <circle cx="200" cy="200" r="196" strokeWidth={0.75} opacity={0.5} />
      <circle cx="200" cy="200" r="178" strokeWidth={1.25} />
      <circle cx="200" cy="200" r="132" strokeWidth={0.75} opacity={0.7} />
      <circle cx="200" cy="200" r="90" strokeWidth={1} />
      <circle cx="200" cy="200" r="60" strokeWidth={0.5} opacity={0.5} />

      {Array.from({ length: tickCount }, (_, i) => {
        const angle = (i / tickCount) * Math.PI * 2;
        const isMajor = i % 5 === 0;
        const r1 = isMajor ? 186 : 190;
        const r2 = 196;
        return (
          <line
            key={i}
            x1={round(200 + r1 * Math.cos(angle))}
            y1={round(200 + r1 * Math.sin(angle))}
            x2={round(200 + r2 * Math.cos(angle))}
            y2={round(200 + r2 * Math.sin(angle))}
            strokeWidth={isMajor ? 1 : 0.5}
            opacity={isMajor ? 0.8 : 0.4}
          />
        );
      })}

      {outerGlyphs.map((g) => (
        <RuneGlyph key={g.key} variant={g.variant} x={g.cx} y={g.cy} rotation={g.rotation} />
      ))}
      {innerGlyphs.map((g) => (
        <RuneGlyph key={g.key} variant={g.variant} x={g.cx} y={g.cy} rotation={g.rotation} />
      ))}

      {/* Six-point star lattice connecting the inner ring */}
      {Array.from({ length: 6 }, (_, i) => {
        const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 2) / 6) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={round(200 + 90 * Math.cos(a1))}
            y1={round(200 + 90 * Math.sin(a1))}
            x2={round(200 + 90 * Math.cos(a2))}
            y2={round(200 + 90 * Math.sin(a2))}
            strokeWidth={0.6}
            opacity={0.45}
          />
        );
      })}
    </svg>
  );
}
