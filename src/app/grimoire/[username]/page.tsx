import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GrimoireBook } from "@/components/grimoire/GrimoireBook";
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

const SCOUTING_ROWS: Array<{ label: string; key: keyof ReturnType<typeof metricsFrom> }> = [
  { label: "Total Commits", key: "totalCommits" },
  { label: "Current Streak", key: "currentStreak" },
  { label: "Longest Streak", key: "longestStreak" },
  { label: "Followers", key: "followers" },
  { label: "Public Repos", key: "publicRepos" },
  { label: "Stars Received", key: "totalStars" },
  { label: "Forks", key: "totalForks" },
  { label: "Pull Requests", key: "totalPRs" },
  { label: "Merged PRs", key: "mergedPRs" },
  { label: "Issues Closed", key: "closedIssues" },
  { label: "Organizations", key: "organizations" },
  { label: "Account Age", key: "accountAgeDays" },
];

function metricsFrom(grimoire: NonNullable<Awaited<ReturnType<typeof getGrimoire>>>) {
  return {
    totalCommits: grimoire.totalCommits,
    currentStreak: grimoire.currentStreak,
    longestStreak: grimoire.longestStreak,
    followers: grimoire.followers,
    publicRepos: grimoire.publicRepos,
    totalStars: grimoire.totalStars,
    totalForks: grimoire.totalForks,
    totalPRs: grimoire.totalPRs,
    mergedPRs: grimoire.mergedPRs,
    closedIssues: grimoire.closedIssues,
    organizations: grimoire.organizations,
    accountAgeDays: grimoire.accountAgeDays,
  };
}

function formatValue(key: string, value: number): string {
  if (key === "accountAgeDays") {
    const years = value / 365;
    return years >= 1 ? `${years.toFixed(1)} yrs` : `${value} days`;
  }
  if (key === "currentStreak" || key === "longestStreak") return `${value} days`;
  return value.toLocaleString();
}

export default async function GrimoirePage({ params }: PageProps) {
  const { username } = await params;
  const grimoire = await getGrimoire(username);

  if (!grimoire) notFound();

  const rarity = isFounder(grimoire.login) ? BLACK_CLOVER_STYLE : RARITY_STYLE[grimoire.rarity];
  const metrics = metricsFrom(grimoire);
  const githubUrl = `https://github.com/${grimoire.login}`;

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

      {/* GitHub identity — gitfut-style: who this is and a direct link to their real profile. */}
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-background-elevated/60 p-5 flex items-center gap-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 ring-1 ring-gold/30">
          <Image src={grimoire.avatarUrl} alt={grimoire.login} fill sizes="64px" className="object-cover" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base sm:text-lg text-gold-bright truncate">
            {grimoire.name ?? grimoire.login}
          </p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-muted hover:text-gold-bright transition-colors truncate block"
          >
            github.com/{grimoire.login} ↗
          </a>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-display text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] uppercase px-3 sm:px-4 py-2 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors whitespace-nowrap"
        >
          View on GitHub
        </a>
      </div>

      <GrimoireBook data={grimoire} />

      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-xs tracking-[0.3em] uppercase text-foreground-muted text-center">
            Scouting Report
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SCOUTING_ROWS.map((row) => (
              <div
                key={row.key}
                className="rounded-lg border border-white/10 bg-background-elevated/60 px-4 py-3 flex flex-col gap-1"
              >
                <span className="text-[0.6rem] tracking-[0.15em] uppercase text-foreground-muted">
                  {row.label}
                </span>
                <span className="font-display text-lg text-gold-bright">
                  {formatValue(row.key, metrics[row.key])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {grimoire.languages.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-xs tracking-[0.3em] uppercase text-foreground-muted text-center">
              Top Languages
            </h2>
            {grimoire.languages.slice(0, 5).map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <span className="w-20 sm:w-24 text-xs text-foreground-muted truncate shrink-0">{lang.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.max(lang.percentage, 2)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-gold-bright tabular-nums shrink-0">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {grimoire.messages.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-2 text-center">
          {grimoire.messages.map((msg) => (
            <p key={msg} className="font-display italic text-sm text-foreground-muted">
              &ldquo;{msg}&rdquo;
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/duel?a=${encodeURIComponent(grimoire.login)}`}
          className="font-display text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-gold text-black hover:bg-gold-bright transition-colors"
        >
          Challenge to a Duel
        </Link>
        <Link
          href="/leaderboard"
          className="font-display text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
        >
          View Leaderboard
        </Link>
      </div>
    </main>
  );
}
