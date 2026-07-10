import type { Metadata } from "next";
import Link from "next/link";
import { DuelScene } from "@/components/duel/DuelScene";
import { computeDuel } from "@/lib/scoring/duel";
import { getOrSummonGrimoire } from "@/lib/summon";

interface PageProps {
  params: Promise<{ a: string; b: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { a, b } = await params;
  return { title: `${decodeURIComponent(a)} vs ${decodeURIComponent(b)} — Duel — GitGrimoire` };
}

export default async function DuelResultPage({ params }: PageProps) {
  const { a, b } = await params;
  const loginA = decodeURIComponent(a);
  const loginB = decodeURIComponent(b);

  const [grimoireA, grimoireB] = await Promise.all([
    getOrSummonGrimoire(loginA),
    getOrSummonGrimoire(loginB),
  ]);

  if (!grimoireA || !grimoireB) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 gap-6 text-center">
        <p className="font-display text-xl text-gold-bright">The kingdom has no record of this duel.</p>
        <p className="text-sm text-foreground-muted max-w-sm">
          {!grimoireA && <>@{loginA} could not be summoned. </>}
          {!grimoireB && <>@{loginB} could not be summoned.</>}
        </p>
        <Link
          href="/duel"
          className="font-display text-xs tracking-[0.15em] uppercase px-6 py-3 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
        >
          Try Another Duel
        </Link>
      </main>
    );
  }

  const result = computeDuel(grimoireA, grimoireB);

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-16">
      <DuelScene a={grimoireA} b={grimoireB} result={result} />
    </main>
  );
}
