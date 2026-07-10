import type { GithubStats } from "@/types/github";
import type { Grimoire, MagicRank } from "@/types/grimoire";

const MILESTONES: Array<{ min: number; message: string }> = [
  { min: 10000, message: "The road to the Wizard King lies before you." },
  { min: 5000, message: "Few possess power equal to yours." },
  { min: 1000, message: "The kingdom recognizes your strength." },
  { min: 500, message: "Your mana has evolved." },
  { min: 100, message: "Your Grimoire has unlocked a new spell." },
];

const HIGH_RANKS: MagicRank[] = ["Vice Captain", "Captain", "Grand Magic Knight", "Wizard King Candidate", "Wizard King"];
const TOP_RANKS: MagicRank[] = ["Wizard King Candidate", "Wizard King"];

interface Condition {
  message: string;
  test: (stats: GithubStats, overall: number, rank: MagicRank) => boolean;
}

const CONDITIONS: Condition[] = [
  { message: "The Wizard King has taken interest in your progress.", test: (_s, overall) => overall >= 95 },
  { message: "The people believe you may become the next Wizard King.", test: (_s, _o, rank) => TOP_RANKS.includes(rank) },
  { message: "Your mana has surpassed that of many captains.", test: (_s, overall) => overall >= 85 },
  { message: "Legends speak of developers with power such as yours.", test: (_s, overall) => overall >= 90 },
  { message: "The captains have begun to notice your accomplishments.", test: (_s, _o, rank) => HIGH_RANKS.includes(rank) },
  { message: "Your name echoes throughout the Clover Kingdom.", test: (s) => s.followers >= 500 },
  { message: "Your squad celebrates another successful mission.", test: (s) => s.mergedPRs > 0 },
  { message: "A new page has appeared within your Grimoire.", test: (s) => s.currentStreak > 0 },
  { message: "Another spell has been engraved into your Grimoire.", test: (s) => s.totalCommits > 0 },
  { message: "Your mana continues to grow.", test: () => true },
];

export function computeDynamicMessages(
  stats: GithubStats,
  overall: number,
  rank: MagicRank
): string[] {
  const milestone = MILESTONES.find((entry) => stats.totalCommits >= entry.min);

  const matched = CONDITIONS.filter((condition) => condition.test(stats, overall, rank)).map(
    (condition) => condition.message
  );

  const messages = [milestone?.message, ...matched].filter((msg): msg is string => Boolean(msg));

  return Array.from(new Set(messages)).slice(0, 4);
}

export function grimoireToMessages(grimoire: Pick<Grimoire, "raw" | "overall" | "rank">): string[] {
  return computeDynamicMessages(grimoire.raw, grimoire.overall, grimoire.rank);
}
