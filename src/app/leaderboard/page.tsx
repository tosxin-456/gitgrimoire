import Link from "next/link";
import { LeaderboardPanel } from "@/components/leaderboard/LeaderboardPanel";
import { getLeaderboards } from "@/lib/leaderboard";

export const metadata = {
  title: "Leaderboard — GitGrimoire",
  description: "The Clover Kingdom's most powerful developers, ranked by mana, rank, and rarity.",
};

export default async function LeaderboardPage() {
  const {
    topMana,
    topCaptains,
    topWizardKingCandidates,
    highestOverall,
    longestStreak,
    mostPowerfulGrimoires,
  } = await getLeaderboards();

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-16 gap-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/"
          className="font-display text-[0.65rem] tracking-[0.35em] uppercase text-foreground-muted hover:text-gold-bright transition-colors"
        >
          GitGrimoire
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-shimmer glow-gold">The Clover Kingdom Leaderboard</h1>
        <p className="text-sm text-foreground-muted max-w-md">
          The realm&apos;s strongest developers, as measured by their real GitHub deeds.
        </p>
        <Link
          href="/duel"
          className="mt-1 font-display text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
        >
          Enter the Duel Arena
        </Link>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaderboardPanel
          title="Highest Overall Rating"
          description="The most complete Magic Knights in the kingdom."
          entries={highestOverall}
          valueLabel="OVR"
          getValue={(e) => e.overall}
        />
        <LeaderboardPanel
          title="Top Mana"
          description="Those whose mana burns brightest."
          entries={topMana}
          valueLabel="Mana"
          getValue={(e) => e.stats.mana}
        />
        <LeaderboardPanel
          title="Top Captains"
          description="Squad Captains and Grand Magic Knights."
          entries={topCaptains}
          valueLabel="OVR"
          getValue={(e) => e.overall}
        />
        <LeaderboardPanel
          title="Wizard King Candidates"
          description="Those tipped to one day rule the kingdom."
          entries={topWizardKingCandidates}
          valueLabel="OVR"
          getValue={(e) => e.overall}
        />
        <LeaderboardPanel
          title="Longest Streak"
          description="Unbroken days of dedication."
          entries={longestStreak}
          valueLabel="Days"
          getValue={(e) => e.longestStreak}
        />
        <LeaderboardPanel
          title="Most Powerful Grimoires"
          description="Ranked by rarity, then overall rating."
          entries={mostPowerfulGrimoires}
          valueLabel=""
          getValue={(e) => e.rarity}
        />
      </div>
    </main>
  );
}
