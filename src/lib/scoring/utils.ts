export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Log-scaled 1-99 score: cheap early gains, diminishing returns near the cap. */
export function scale(value: number, cap: number): number {
  if (value <= 0) return 1;
  const score = (Math.log1p(value) / Math.log1p(cap)) * 99;
  return clamp(Math.round(score), 1, 99);
}

/** Deterministic 32-bit FNV-1a hash, used for reproducible tie-breaks and "luck" rolls. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic pseudo-random float in [0, 1) derived from a seed string. */
export function seededUnit(seed: string): number {
  return hashString(seed) / 0xffffffff;
}
