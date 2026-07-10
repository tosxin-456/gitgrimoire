import type { GithubStats, LanguageStat } from "./github";

export type MagicAttribute =
  | "Anti Magic"
  | "Lightning Magic"
  | "Time Magic"
  | "Steel Magic"
  | "Wind Magic"
  | "Spatial Magic"
  | "Earth Magic"
  | "Dark Magic"
  | "Dream Magic"
  | "Creation Magic"
  | "Water Magic"
  | "Flame Magic"
  | "World Tree Magic";

export type MagicRank =
  | "Unranked"
  | "Junior Magic Knight"
  | "Intermediate Magic Knight"
  | "Senior Magic Knight"
  | "Vice Captain"
  | "Captain"
  | "Grand Magic Knight"
  | "Wizard King Candidate"
  | "Wizard King";

export type Squad =
  | "Black Bulls"
  | "Golden Dawn"
  | "Crimson Lion"
  | "Silver Eagles"
  | "Blue Rose"
  | "Green Mantis"
  | "Coral Peacock"
  | "Purple Orca"
  | "Azure Deer";

export type GrimoireRarity =
  | "Common"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Three-Leaf"
  | "Four-Leaf"
  | "Five-Leaf";

export interface CardStats {
  mana: number;
  spellMastery: number;
  battleExperience: number;
  leadership: number;
  control: number;
  potential: number;
}

export interface Grimoire {
  login: string;
  name: string | null;
  avatarUrl: string;
  attribute: MagicAttribute;
  rank: MagicRank;
  squad: Squad;
  rarity: GrimoireRarity;
  overall: number;
  stats: CardStats;
  messages: string[];
  previousRank?: MagicRank | null;
  raw: GithubStats;
}

/** The minimal shape the visual Grimoire book needs — both `Grimoire` and `PublicGrimoire` satisfy it. */
export interface GrimoireBookData {
  login: string;
  name: string | null;
  avatarUrl: string;
  attribute: MagicAttribute;
  rank: MagicRank;
  squad: Squad;
  rarity: GrimoireRarity;
  overall: number;
  stats: CardStats;
  messages: string[];
}

/** Slimmer, DB-backed view used for public profile pages and leaderboards. */
export interface PublicGrimoire {
  login: string;
  name: string | null;
  avatarUrl: string;
  attribute: MagicAttribute;
  rank: MagicRank;
  squad: Squad;
  rarity: GrimoireRarity;
  overall: number;
  stats: CardStats;
  messages: string[];
  previousRank: MagicRank | null;
  topLanguage: string | null;
  languages: LanguageStat[];
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalPRs: number;
  mergedPRs: number;
  closedIssues: number;
  organizations: number;
  accountAgeDays: number;
  updatedAt: string;
}
