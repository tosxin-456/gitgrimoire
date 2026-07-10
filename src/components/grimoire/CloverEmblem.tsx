interface CloverEmblemProps {
  leafCount: number;
  size?: number;
  color?: string;
  /** Optional stroke around each leaf — used for the black clover on dark covers. */
  outline?: string;
  className?: string;
}

/**
 * A single heart-shaped clover leaf, as drawn on the grimoire covers in the
 * show: two rounded lobes, a cleft notch at the outer edge, tapering to a
 * point at the clover's center. Drawn pointing up; rotated into place.
 */
function Leaf({ rotation, color, outline }: { rotation: number; color: string; outline?: string }) {
  return (
    <path
      d="M50 50 C34 37 28 24 34 16 C39 9.5 48 11 50 19 C52 11 61 9.5 66 16 C72 24 66 37 50 50 Z"
      fill={color}
      stroke={outline}
      strokeWidth={outline ? 1.5 : 0}
      strokeLinejoin="round"
      transform={`rotate(${rotation} 50 50)`}
    />
  );
}

/**
 * Grimoire cover emblems. Common→Gold get a gem/seal; the clover tiers match
 * the anime: a shamrock three-leaf (faith, hope, love), a four-leaf cross
 * with a stem (luck), and the five-leaf — where a fifth leaf grows in place
 * of the stem (a devil dwells within).
 */
export function CloverEmblem({
  leafCount,
  size = 96,
  color = "var(--gold)",
  outline,
  className,
}: CloverEmblemProps) {
  if (leafCount <= 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
        <path
          d="M50 6 88 28v44L50 94 12 72V28Z"
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
        <path d="M50 22 74 36v28L50 78 26 64V36Z" fill={color} opacity={0.85} />
      </svg>
    );
  }

  // Leaf directions per tier, degrees clockwise from "up", matching the
  // covers in the show:
  // 3-leaf: classic shamrock — one up, two flanking low, stem in the bottom gap.
  // 4-leaf: × arrangement, no stem (Yuno's cover).
  // 5-leaf: five leaves in an even rosette, no stem (Asta's cover).
  const leafAngles =
    leafCount === 3
      ? [0, 120, 240]
      : leafCount === 4
        ? [45, 135, 225, 315]
        : [0, 72, 144, 216, 288];

  const hasStem = leafCount === 3;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      {leafAngles.map((angle) => (
        <Leaf key={angle} rotation={angle} color={color} outline={outline} />
      ))}
      {hasStem && (
        <>
          <path
            d="M50 52 C50 64 48 72 42 84"
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="4.5" fill={color} stroke={outline} strokeWidth={outline ? 1 : 0} />
        </>
      )}
    </svg>
  );
}
