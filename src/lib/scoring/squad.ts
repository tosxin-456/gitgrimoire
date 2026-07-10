import type { GithubStats } from "@/types/github";
import type { CardStats, Squad } from "@/types/grimoire";
import { scale } from "./utils";

const FRONTEND_LANGUAGES = new Set(["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte"]);
const DATA_LANGUAGES = new Set(["Python", "R", "Jupyter Notebook", "Julia"]);
const BACKEND_TOPICS = new Set(["backend", "api", "microservices", "server", "database"]);

function pct01(score: number): number {
  return score / 99;
}

export function computeSquad(stats: GithubStats, cardStats: CardStats): Squad {
  const languageDiversity =
    Math.min(stats.languages.filter((lang) => lang.percentage >= 8).length, 8) / 8;

  const frontendPct =
    stats.languages
      .filter((lang) => FRONTEND_LANGUAGES.has(lang.name))
      .reduce((sum, lang) => sum + lang.percentage, 0) / 100;

  const dataPct =
    stats.languages
      .filter((lang) => DATA_LANGUAGES.has(lang.name))
      .reduce((sum, lang) => sum + lang.percentage, 0) / 100;

  const starsPerRepo = stats.totalStars / Math.max(stats.publicRepos, 1);
  const followersPerRepo = stats.followers / Math.max(stats.publicRepos, 1);
  const mergeRatio = stats.totalPRs > 0 ? stats.mergedPRs / stats.totalPRs : 0.5;
  const hasBackendTopic = stats.topics.some((topic) => BACKEND_TOPICS.has(topic)) ? 1 : 0;

  const scores: Record<Squad, number> = {
    "Black Bulls": languageDiversity * 0.6 + pct01(scale(stats.publicRepos, 150)) * 0.4,

    "Golden Dawn":
      pct01(scale(stats.totalStars, 3000)) * 0.5 +
      pct01(scale(stats.followers, 3000)) * 0.3 +
      mergeRatio * 0.2,

    "Crimson Lion":
      pct01(scale(stats.organizations.length, 10)) * 0.4 +
      pct01(cardStats.leadership) * 0.3 +
      pct01(cardStats.battleExperience) * 0.3,

    "Silver Eagles":
      pct01(cardStats.control) * 0.6 + pct01(scale(stats.longestStreak, 300)) * 0.4,

    "Blue Rose": frontendPct * 0.5 + pct01(cardStats.spellMastery) * 0.5,

    "Green Mantis": dataPct * 0.5 + pct01(scale(starsPerRepo, 100)) * 0.5,

    "Coral Peacock":
      pct01(scale(followersPerRepo, 50)) * 0.6 + pct01(cardStats.mana) * 0.4,

    "Purple Orca":
      (1 - pct01(scale(stats.accountAgeDays, 5000))) * 0.5 + pct01(cardStats.potential) * 0.5,

    "Azure Deer":
      pct01(scale(stats.closedIssues, 300)) * 0.5 +
      pct01(cardStats.control) * 0.3 +
      hasBackendTopic * 0.2,
  };

  const [bestSquad] = (Object.entries(scores) as Array<[Squad, number]>).reduce((best, current) =>
    current[1] > best[1] ? current : best
  );

  return bestSquad;
}
