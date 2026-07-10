"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GrimoireBook } from "@/components/grimoire/GrimoireBook";
import { SealedGrimoireCover } from "@/components/ceremony/SealedGrimoireCover";
import { MagicCircleBackdrop } from "@/components/visual/MagicCircleBackdrop";
import { ParticleField } from "@/components/visual/ParticleField";
import type { PublicGrimoire } from "@/types/grimoire";

const STATUS_LINES = [
  "Reading the commit scrolls...",
  "Measuring your mana flow...",
  "Weighing your battle experience...",
  "Consulting the Magic Parliament...",
  "Sealing your Grimoire...",
];

interface CeremonyResult {
  grimoire: PublicGrimoire;
  promoted: boolean;
  promotionMessage: [string, string] | null;
  previousRank: string | null;
}

export function CeremonyScene({ login }: { login: string }) {
  const [phase, setPhase] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState<CeremonyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/grimoire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.grimoire) setResult(json);
        else setError(json.error ?? "The Grimoire could not be read.");
      })
      .catch(() => {
        if (!cancelled) setError("The kingdom's magic could not reach GitHub.");
      });
    return () => {
      cancelled = true;
    };
  }, [login]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3600),
      setTimeout(() => setPhase(5), 4700),
      setTimeout(() => setPhase(6), 5700),
      setTimeout(() => setPhase(7), 6400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase < 5) return;
    const interval = setInterval(() => setStatusIndex((i) => (i + 1) % STATUS_LINES.length), 900);
    return () => clearInterval(interval);
  }, [phase]);

  const showReveal = phase >= 7 && Boolean(result);
  const analyzing = phase >= 5 && !showReveal;

  const headline =
    result?.promoted && result.promotionMessage
      ? result.promotionMessage[0]
      : "The Grimoire has chosen its owner.";
  const subline = result?.promoted && result.promotionMessage ? result.promotionMessage[1] : null;

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 1 ? 0 : 1 }}
        transition={{ duration: 1 }}
      />

      {phase >= 1 && <ParticleField count={70} className="z-0" />}

      {phase >= 2 && (
        <motion.div
          className="absolute z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <MagicCircleBackdrop size={720} />
        </motion.div>
      )}

      {phase >= 6 && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-20"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(245,223,160,0.9), rgba(232,196,104,0.25) 45%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.3, times: [0, 0.35, 1] }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        {phase < 2 && (
          <p className="font-display text-sm tracking-[0.3em] uppercase text-foreground-muted">
            A presence stirs in the dark...
          </p>
        )}

        <AnimatePresence mode="wait">
          {!showReveal ? (
            <motion.div
              key="sealed"
              className="flex flex-col items-center gap-8"
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5 }}
            >
              {phase >= 3 && (
                <motion.div
                  className="relative w-full max-w-md aspect-[16/10]"
                  initial={{ opacity: 0, scale: 0.25, y: 260 }}
                  animate={
                    phase >= 4
                      ? { opacity: 1, scale: 1, y: [0, -14, 0] }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  transition={
                    phase >= 4
                      ? { y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }
                      : { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1/2 perspective-1600">
                    <SealedGrimoireCover turningPages={phase === 5} />
                  </div>
                </motion.div>
              )}

              {analyzing && (
                <motion.p
                  key={error ? "error" : statusIndex}
                  className="font-display text-sm sm:text-base tracking-[0.2em] uppercase text-gold-bright text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {error ?? STATUS_LINES[statusIndex]}
                </motion.p>
              )}

              {error && (
                <Link
                  href="/"
                  className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
                >
                  Return to the Gate
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <p className="font-display text-2xl sm:text-4xl text-gold-bright glow-gold">{headline}</p>
                {subline && (
                  <p className="mt-2 font-display text-base sm:text-lg text-foreground-muted">{subline}</p>
                )}
              </motion.div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                  className="w-full flex flex-col items-center gap-6"
                >
                  {/* Actions live above the book so they're visible without scrolling. */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                      href={`/grimoire/${encodeURIComponent(result.grimoire.login)}`}
                      className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full bg-gold text-black hover:bg-gold-bright transition-colors"
                    >
                      View Full Grimoire
                    </Link>
                    <Link
                      href="/leaderboard"
                      className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
                    >
                      View Leaderboard
                    </Link>
                    <Link
                      href={`/duel?a=${encodeURIComponent(result.grimoire.login)}`}
                      className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
                    >
                      Duel a Rival
                    </Link>
                  </div>

                  {/* The grimoire arrives sealed — the owner opens it themselves. */}
                  <GrimoireBook data={result.grimoire} />

                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Mana Level</p>
                    <p className="font-display text-3xl text-mana-blue glow-gold">
                      {result.grimoire.stats.mana} / 99
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
