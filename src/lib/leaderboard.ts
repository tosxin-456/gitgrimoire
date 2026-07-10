import { toPublicGrimoire } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";
import type { PublicGrimoire } from "@/types/grimoire";

const RARITY_WEIGHT: Record<string, number> = {
  "Five-Leaf": 6,
  "Four-Leaf": 5,
  "Three-Leaf": 4,
  Gold: 3,
  Silver: 2,
  Bronze: 1,
  Common: 0,
};

const LIMIT = 10;

export interface Leaderboards {
  topMana: PublicGrimoire[];
  topCaptains: PublicGrimoire[];
  topWizardKingCandidates: PublicGrimoire[];
  highestOverall: PublicGrimoire[];
  longestStreak: PublicGrimoire[];
  mostPowerfulGrimoires: PublicGrimoire[];
}

export async function getLeaderboards(): Promise<Leaderboards> {
  const [topMana, topCaptains, topWizardKingCandidates, highestOverall, longestStreak, rarityPool] =
    await Promise.all([
      prisma.grimoire.findMany({ orderBy: { mana: "desc" }, take: LIMIT }),
      prisma.grimoire.findMany({
        where: { rank: { in: ["Captain", "Grand Magic Knight"] } },
        orderBy: { overall: "desc" },
        take: LIMIT,
      }),
      prisma.grimoire.findMany({
        where: { rank: "Wizard King Candidate" },
        orderBy: { overall: "desc" },
        take: LIMIT,
      }),
      prisma.grimoire.findMany({ orderBy: { overall: "desc" }, take: LIMIT }),
      prisma.grimoire.findMany({ orderBy: { longestStreak: "desc" }, take: LIMIT }),
      prisma.grimoire.findMany({ orderBy: { overall: "desc" }, take: 50 }),
    ]);

  const mostPowerfulGrimoires: PublicGrimoire[] = rarityPool
    .map(toPublicGrimoire)
    .sort((a, b) => {
      const diff = RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
      return diff !== 0 ? diff : b.overall - a.overall;
    })
    .slice(0, LIMIT);

  return {
    topMana: topMana.map(toPublicGrimoire),
    topCaptains: topCaptains.map(toPublicGrimoire),
    topWizardKingCandidates: topWizardKingCandidates.map(toPublicGrimoire),
    highestOverall: highestOverall.map(toPublicGrimoire),
    longestStreak: longestStreak.map(toPublicGrimoire),
    mostPowerfulGrimoires,
  };
}
