import Link from "next/link";
import { MagicCircleBackdrop } from "@/components/visual/MagicCircleBackdrop";
import { ParticleField } from "@/components/visual/ParticleField";
import { SummonForm } from "@/components/landing/SummonForm";

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-screen px-4">
      <ParticleField count={45} className="z-0" />

      <div className="absolute z-0 flex items-center justify-center">
        <MagicCircleBackdrop size={780} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-2xl">
        <p className="font-display text-[0.7rem] sm:text-xs tracking-[0.4em] uppercase text-foreground-muted">
          GitGrimoire
        </p>

        <h1 className="font-display text-3xl sm:text-5xl leading-relaxed text-shimmer glow-gold">
          Every mage is chosen
          <br />
          by a Grimoire.
          <br />
          <span className="italic">Every developer deserves one too.</span>
        </h1>

        <SummonForm />

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link
            href="/leaderboard"
            className="text-xs sm:text-sm tracking-[0.15em] uppercase text-foreground-muted hover:text-gold-bright transition-colors"
          >
            View the Clover Kingdom Leaderboard →
          </Link>
          <Link
            href="/duel"
            className="text-xs sm:text-sm tracking-[0.15em] uppercase text-foreground-muted hover:text-gold-bright transition-colors"
          >
            Challenge a Rival to a Duel →
          </Link>
        </div>
      </div>

      <p className="relative z-10 mt-16 text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted/60 text-center px-4">
        Powered by real GitHub activity — commits, streaks, and contributions forge every page.
      </p>
    </main>
  );
}
