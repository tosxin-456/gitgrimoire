import { fetchGithubStats, isValidGithubLogin } from "@/lib/github";
import { saveGrimoire, toPublicGrimoire } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";
import { computeGrimoire } from "@/lib/scoring";
import type { MagicRank, PublicGrimoire } from "@/types/grimoire";

export interface SummonOutcome {
  grimoire: PublicGrimoire;
  promoted: boolean;
  previousRank: MagicRank | null;
}

/** Fetches fresh GitHub stats, scores them, and upserts the result. Throws on failure. */
export async function summonGrimoire(login: string): Promise<SummonOutcome> {
  const stats = await fetchGithubStats(login);
  const grimoire = computeGrimoire(stats);
  const { record, promoted, previousRank } = await saveGrimoire(grimoire);
  return {
    grimoire: toPublicGrimoire(record),
    promoted,
    previousRank: previousRank as MagicRank | null,
  };
}

/**
 * Reads an already-summoned grimoire straight from the DB; if this login has
 * never been summoned, fetches and saves it on the fly. Returns null instead
 * of throwing so callers (e.g. the duel page) can show a per-side fallback.
 */
export async function getOrSummonGrimoire(login: string): Promise<PublicGrimoire | null> {
  const existing = await prisma.grimoire.findUnique({ where: { login } });
  if (existing) return toPublicGrimoire(existing);

  if (!isValidGithubLogin(login)) return null;

  try {
    const { grimoire } = await summonGrimoire(login);
    return grimoire;
  } catch {
    return null;
  }
}
