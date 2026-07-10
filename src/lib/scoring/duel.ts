import type { CardStats, PublicGrimoire } from "@/types/grimoire";

export type DuelSide = "a" | "b";

export interface DuelResult {
  winner: DuelSide | "draw";
  reason: string;
  aScore: number;
  bScore: number;
}

const STAT_KEYS: Array<keyof CardStats> = [
  "mana",
  "spellMastery",
  "battleExperience",
  "leadership",
  "control",
  "potential",
];

function statSum(g: PublicGrimoire): number {
  return STAT_KEYS.reduce((sum, key) => sum + g.stats[key], 0);
}

/**
 * Deterministic so a duel URL always resolves the same way: Overall Rating
 * decides first, then combined stats, then stars, then commits, and a true
 * tie (mirror match) is a draw. No randomness — this runs on every page view.
 */
export function computeDuel(a: PublicGrimoire, b: PublicGrimoire): DuelResult {
  if (a.overall !== b.overall) {
    return {
      winner: a.overall > b.overall ? "a" : "b",
      reason: "Overall Rating",
      aScore: a.overall,
      bScore: b.overall,
    };
  }

  const sumA = statSum(a);
  const sumB = statSum(b);
  if (sumA !== sumB) {
    return { winner: sumA > sumB ? "a" : "b", reason: "Combined Stats", aScore: sumA, bScore: sumB };
  }

  if (a.totalStars !== b.totalStars) {
    return {
      winner: a.totalStars > b.totalStars ? "a" : "b",
      reason: "Stars Earned",
      aScore: a.totalStars,
      bScore: b.totalStars,
    };
  }

  if (a.totalCommits !== b.totalCommits) {
    return {
      winner: a.totalCommits > b.totalCommits ? "a" : "b",
      reason: "Total Commits",
      aScore: a.totalCommits,
      bScore: b.totalCommits,
    };
  }

  return { winner: "draw", reason: "Perfectly Matched", aScore: a.overall, bScore: b.overall };
}

export function duelVerdict(winnerName: string, reason: string): string {
  return `${winnerName} takes the duel — decided by ${reason}.`;
}
