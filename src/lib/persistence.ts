import type { Grimoire as PrismaGrimoire } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPromotion } from "@/lib/scoring/rank";
import type { Grimoire, MagicRank, PublicGrimoire } from "@/types/grimoire";

export async function saveGrimoire(
  grimoire: Grimoire
): Promise<{ record: PrismaGrimoire; promoted: boolean; previousRank: string | null }> {
  const existing = await prisma.grimoire.findUnique({ where: { login: grimoire.login } });

  const shared = {
    name: grimoire.name,
    avatarUrl: grimoire.avatarUrl,
    attribute: grimoire.attribute,
    rank: grimoire.rank,
    squad: grimoire.squad,
    rarity: grimoire.rarity,
    overall: grimoire.overall,
    mana: grimoire.stats.mana,
    spellMastery: grimoire.stats.spellMastery,
    battleExperience: grimoire.stats.battleExperience,
    leadership: grimoire.stats.leadership,
    control: grimoire.stats.control,
    potential: grimoire.stats.potential,
    totalCommits: grimoire.raw.totalCommits,
    currentStreak: grimoire.raw.currentStreak,
    longestStreak: grimoire.raw.longestStreak,
    followers: grimoire.raw.followers,
    publicRepos: grimoire.raw.publicRepos,
    totalStars: grimoire.raw.totalStars,
    totalForks: grimoire.raw.totalForks,
    totalPRs: grimoire.raw.totalPRs,
    mergedPRs: grimoire.raw.mergedPRs,
    closedIssues: grimoire.raw.closedIssues,
    organizations: grimoire.raw.organizations.length,
    accountAgeDays: grimoire.raw.accountAgeDays,
    messages: JSON.stringify(grimoire.messages),
    topLanguage: grimoire.raw.languages[0]?.name ?? null,
    languagesJson: JSON.stringify(grimoire.raw.languages.slice(0, 6)),
  };

  const record = await prisma.grimoire.upsert({
    where: { login: grimoire.login },
    create: { login: grimoire.login, previousRank: null, ...shared },
    update: { previousRank: existing?.rank ?? null, ...shared },
  });

  const promoted = existing
    ? isPromotion(existing.rank as MagicRank, grimoire.rank as MagicRank)
    : false;

  return { record, promoted, previousRank: existing?.rank ?? null };
}

export function toPublicGrimoire(record: PrismaGrimoire): PublicGrimoire {
  return {
    login: record.login,
    name: record.name,
    avatarUrl: record.avatarUrl,
    attribute: record.attribute as PublicGrimoire["attribute"],
    rank: record.rank as MagicRank,
    squad: record.squad as PublicGrimoire["squad"],
    rarity: record.rarity as PublicGrimoire["rarity"],
    overall: record.overall,
    stats: {
      mana: record.mana,
      spellMastery: record.spellMastery,
      battleExperience: record.battleExperience,
      leadership: record.leadership,
      control: record.control,
      potential: record.potential,
    },
    messages: JSON.parse(record.messages),
    previousRank: record.previousRank as MagicRank | null,
    topLanguage: record.topLanguage,
    languages: JSON.parse(record.languagesJson),
    totalCommits: record.totalCommits,
    currentStreak: record.currentStreak,
    longestStreak: record.longestStreak,
    followers: record.followers,
    publicRepos: record.publicRepos,
    totalStars: record.totalStars,
    totalForks: record.totalForks,
    totalPRs: record.totalPRs,
    mergedPRs: record.mergedPRs,
    closedIssues: record.closedIssues,
    organizations: record.organizations,
    accountAgeDays: record.accountAgeDays,
    updatedAt: record.updatedAt.toISOString(),
  };
}
