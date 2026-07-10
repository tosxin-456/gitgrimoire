import type { MagicRank } from "@/types/grimoire";

const RANK_THRESHOLDS: Array<{ min: number; rank: MagicRank }> = [
  { min: 98, rank: "Wizard King" },
  { min: 93, rank: "Wizard King Candidate" },
  { min: 88, rank: "Grand Magic Knight" },
  { min: 82, rank: "Captain" },
  { min: 76, rank: "Vice Captain" },
  { min: 69, rank: "Senior Magic Knight" },
  { min: 62, rank: "Intermediate Magic Knight" },
  { min: 55, rank: "Junior Magic Knight" },
  { min: 0, rank: "Unranked" },
];

export const RANK_ORDER: MagicRank[] = [
  "Unranked",
  "Junior Magic Knight",
  "Intermediate Magic Knight",
  "Senior Magic Knight",
  "Vice Captain",
  "Captain",
  "Grand Magic Knight",
  "Wizard King Candidate",
  "Wizard King",
];

export function computeRank(overall: number): MagicRank {
  const match = RANK_THRESHOLDS.find((entry) => overall >= entry.min);
  return match?.rank ?? "Unranked";
}

export function isPromotion(previous: MagicRank | null | undefined, next: MagicRank): boolean {
  if (!previous) return false;
  return RANK_ORDER.indexOf(next) > RANK_ORDER.indexOf(previous);
}

export function promotionMessage(next: MagicRank): [string, string] {
  return [
    "Your deeds have not gone unnoticed.",
    `The Magic Parliament has promoted you to ${next}.`,
  ];
}
