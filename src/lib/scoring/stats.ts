import type { GithubStats } from "@/types/github";
import type { CardStats } from "@/types/grimoire";
import { clamp, scale } from "./utils";

/**
 * Six FIFA-card-style stats (1-99), each derived from a different slice of
 * GitHub activity so no single metric dominates every stat.
 */
export function computeCardStats(stats: GithubStats): CardStats {
  const topLanguagePct = stats.languages[0]?.percentage ?? 0;
  const mergeRatio = stats.totalPRs > 0 ? stats.mergedPRs / stats.totalPRs : 0.5;
  const accountAgeYears = Math.max(stats.accountAgeDays / 365, 0.25);
  const velocity = stats.totalContributions / accountAgeYears;

  const mana = Math.round(
    0.5 * scale(stats.totalCommits, 6000) +
      0.3 * scale(stats.currentStreak, 200) +
      0.2 * scale(stats.activeDays, 1000)
  );

  // Stars are the clearest signal of real-world recognition, so they carry
  // most of Spell Mastery; a 1000-star cap keeps that signal steep instead
  // of flattening out until someone goes viral.
  const spellMastery = Math.round(
    0.65 * scale(stats.totalStars, 1000) + 0.35 * clamp(Math.round(topLanguagePct), 1, 99)
  );

  const battleExperience = Math.round(
    0.4 * scale(stats.accountAgeDays, 5000) +
      0.35 * scale(stats.totalPRs + stats.closedIssues, 600) +
      0.25 * scale(stats.publicRepos, 150)
  );

  const leadership = Math.round(
    0.5 * scale(stats.followers, 3000) +
      0.3 * scale(stats.organizations.length, 10) +
      0.2 * clamp(Math.round(mergeRatio * 99), 1, 99)
  );

  const control = Math.round(
    0.5 * scale(stats.longestStreak, 300) +
      0.3 * clamp(Math.round(mergeRatio * 99), 1, 99) +
      0.2 * scale(stats.closedIssues, 300)
  );

  const potential = Math.round(
    0.6 * scale(velocity, 3000) + 0.4 * scale(stats.currentStreak, 200)
  );

  return {
    mana: clamp(mana, 1, 99),
    spellMastery: clamp(spellMastery, 1, 99),
    battleExperience: clamp(battleExperience, 1, 99),
    leadership: clamp(leadership, 1, 99),
    control: clamp(control, 1, 99),
    potential: clamp(potential, 1, 99),
  };
}

export function computeOverall(cardStats: CardStats): number {
  const raw =
    0.22 * cardStats.spellMastery +
    0.18 * cardStats.mana +
    0.18 * cardStats.battleExperience +
    0.14 * cardStats.leadership +
    0.14 * cardStats.control +
    0.14 * cardStats.potential;

  return clamp(Math.round(raw), 50, 99);
}
