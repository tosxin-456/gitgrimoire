import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitHubIdentityCard } from "@/components/grimoire/GitHubIdentityCard";
import { GrimoireBook } from "@/components/grimoire/GrimoireBook";
import { ScoutingReport } from "@/components/grimoire/ScoutingReport";
import { BLACK_CLOVER_STYLE, RARITY_STYLE } from "@/lib/data/presentation";
import { isFounder } from "@/lib/founder";
import { toPublicGrimoire } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getGrimoire(username: string) {
  const record = await prisma.grimoire.findUnique({ where: { login: username } });
  return record ? toPublicGrimoire(record) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const grimoire = await getGrimoire(username);

  if (!grimoire) return { title: "Grimoire not found — GitGrimoire" };

  return {
    title: `${grimoire.name ?? grimoire.login}'s Grimoire — GitGrimoire`,
    description: `${grimoire.attribute} · ${grimoire.rank} · ${grimoire.squad} · ${grimoire.overall} OVR`,
  };
}

export default async function GrimoirePage({ params }: PageProps) {
  const { username } = await params;
  const grimoire = await getGrimoire(username);

  if (!grimoire) notFound();

  const rarity = isFounder(grimoire.login) ? BLACK_CLOVER_STYLE : RARITY_STYLE[grimoire.rarity];

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-16 gap-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/"
          className="font-display text-[0.65rem] tracking-[0.35em] uppercase text-foreground-muted hover:text-gold-bright transition-colors"
        >
          GitGrimoire
        </Link>
        <p
          className="font-display text-xs tracking-[0.2em] uppercase"
          style={{ color: rarity.accent ?? rarity.primary }}
        >
          {rarity.description}
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        <GitHubIdentityCard login={grimoire.login} name={grimoire.name} avatarUrl={grimoire.avatarUrl} />

        {/* Primary actions sit above the book so they're never below the fold. */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/duel?a=${encodeURIComponent(grimoire.login)}`}
            className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full bg-gold text-black hover:bg-gold-bright transition-colors"
          >
            Challenge to a Duel
          </Link>
          <Link
            href="/leaderboard"
            className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      <GrimoireBook data={grimoire} />

      <ScoutingReport grimoire={grimoire} />
    </main>
  );
}
