import { isFounder } from "@/lib/founder";
import type { GithubStats } from "@/types/github";
import type { Grimoire } from "@/types/grimoire";
import { computeMagicAttribute } from "./attributes";
import { computeDynamicMessages } from "./messages";
import { computeRank } from "./rank";
import { computeRarity } from "./rarity";
import { computeSquad } from "./squad";
import { computeCardStats, computeOverall } from "./stats";

export function computeGrimoire(stats: GithubStats): Grimoire {
  const cardStats = computeCardStats(stats);
  const overall = computeOverall(cardStats);
  const rank = computeRank(overall);
  const founder = isFounder(stats.login);

  // The founder walks Asta's path: a Black Bull chosen by the black
  // five-leaf grimoire, wielding Anti Magic. Rank and stats stay earned.
  const attribute = founder ? "Anti Magic" : computeMagicAttribute(stats);
  const squad = founder ? "Black Bulls" : computeSquad(stats, cardStats);
  const rarity = founder ? "Five-Leaf" : computeRarity(overall);
  const messages = computeDynamicMessages(stats, overall, rank);
  if (founder) {
    messages.unshift(
      "The magic-less founder — the one who forged GitGrimoire itself. His power: he never gives up."
    );
  }

  return {
    login: stats.login,
    name: stats.name,
    avatarUrl: stats.avatarUrl,
    attribute,
    rank,
    squad,
    rarity,
    overall,
    stats: cardStats,
    messages,
    raw: stats,
  };
}

export * from "./attributes";
export * from "./messages";
export * from "./rank";
export * from "./rarity";
export * from "./squad";
export * from "./stats";
