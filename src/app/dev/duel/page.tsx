import { DuelScene } from "@/components/duel/DuelScene";
import { computeDuel } from "@/lib/scoring/duel";
import type { PublicGrimoire } from "@/types/grimoire";

/**
 * Dev-only gallery: renders DuelScene with mock data so the duel UI can be
 * reviewed without needing two real, already-summoned grimoires.
 * Not linked from anywhere — visit /dev/duel directly.
 */

const mockA: PublicGrimoire = {
  login: "yuno-demo",
  name: "Yuno",
  avatarUrl: "",
  attribute: "Wind Magic",
  rank: "Grand Magic Knight",
  squad: "Golden Dawn",
  rarity: "Four-Leaf",
  overall: 94,
  stats: { mana: 92, spellMastery: 90, battleExperience: 88, leadership: 85, control: 91, potential: 95 },
  messages: [],
  previousRank: null,
  topLanguage: "Go",
  languages: [],
  totalCommits: 8200,
  currentStreak: 40,
  longestStreak: 210,
  followers: 900,
  publicRepos: 60,
  totalStars: 2100,
  totalForks: 300,
  totalPRs: 400,
  mergedPRs: 380,
  closedIssues: 150,
  organizations: 3,
  accountAgeDays: 1800,
  updatedAt: new Date().toISOString(),
};

const mockB: PublicGrimoire = {
  login: "asta-demo",
  name: "Asta",
  avatarUrl: "",
  attribute: "Anti Magic",
  rank: "Senior Magic Knight",
  squad: "Black Bulls",
  rarity: "Five-Leaf",
  overall: 79,
  stats: { mana: 20, spellMastery: 55, battleExperience: 70, leadership: 60, control: 45, potential: 99 },
  messages: [],
  previousRank: null,
  topLanguage: "JavaScript",
  languages: [],
  totalCommits: 5400,
  currentStreak: 90,
  longestStreak: 160,
  followers: 300,
  publicRepos: 40,
  totalStars: 150,
  totalForks: 40,
  totalPRs: 200,
  mergedPRs: 170,
  closedIssues: 90,
  organizations: 1,
  accountAgeDays: 900,
  updatedAt: new Date().toISOString(),
};

export default function DuelPreviewPage() {
  const result = computeDuel(mockA, mockB);

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-16">
      <DuelScene a={mockA} b={mockB} result={result} />
    </main>
  );
}
