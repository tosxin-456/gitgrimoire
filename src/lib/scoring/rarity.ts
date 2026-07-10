import type { GrimoireRarity } from "@/types/grimoire";

/**
 * Rarity is overall-driven and caps at Four-Leaf — even the kingdom's
 * strongest carry a four-leaf clover. The five-leaf chooses exactly one
 * person: the magic-less founder (see computeGrimoire's founder branch),
 * whose only power is that he never gives up.
 */
export function computeRarity(overall: number): GrimoireRarity {
  if (overall >= 91) return "Four-Leaf";
  if (overall >= 85) return "Three-Leaf";
  if (overall >= 77) return "Gold";
  if (overall >= 69) return "Silver";
  if (overall >= 60) return "Bronze";
  return "Common";
}

export const RARITY_LABEL: Record<GrimoireRarity, string> = {
  Common: "Common Grimoire",
  Bronze: "Bronze Grimoire",
  Silver: "Silver Grimoire",
  Gold: "Gold Grimoire",
  "Three-Leaf": "Three-Leaf Grimoire 🍀",
  "Four-Leaf": "Four-Leaf Grimoire 🍀🍀🍀🍀",
  "Five-Leaf": "Five-Leaf Grimoire 😈",
};
