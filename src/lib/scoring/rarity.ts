import type { GrimoireRarity } from "@/types/grimoire";
import { seededUnit } from "./utils";

/**
 * Rarity is mostly overall-driven, but the top tier is deliberately scarce:
 * only a fraction of eligible (96+) grimoires roll a Five-Leaf. The roll is
 * seeded by login so it's reproducible, not re-randomized on every view.
 */
export function computeRarity(overall: number, login: string): GrimoireRarity {
  if (overall >= 96) {
    const luck = seededUnit(`five-leaf:${login}`);
    return luck < (1 / 6) ? "Five-Leaf" : "Four-Leaf";
  }
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
