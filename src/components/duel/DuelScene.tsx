"use client";

import { AnimatePresence, motion, type Easing } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GitHubIdentityCard } from "@/components/grimoire/GitHubIdentityCard";
import { GrimoireCover } from "@/components/grimoire/GrimoireCover";
import { StatCompareBar } from "@/components/duel/StatCompareBar";
import { ATTRIBUTE_STYLE } from "@/lib/data/presentation";
import { duelVerdict, type DuelResult } from "@/lib/scoring/duel";
import type { PublicGrimoire } from "@/types/grimoire";

const STAT_ROWS: Array<{ key: keyof PublicGrimoire["stats"]; label: string }> = [
  { key: "mana", label: "Mana" },
  { key: "spellMastery", label: "Spell Mastery" },
  { key: "battleExperience", label: "Battle Experience" },
  { key: "leadership", label: "Leadership" },
  { key: "control", label: "Control" },
  { key: "potential", label: "Potential" },
];

/**
 * The battle plays on one shared timeline: covers slide in, clash three
 * times (impacts at ~34%, ~56%, and ~80% of the run), then a final burst
 * hands off to the verdict. Every keyframe array below shares BATTLE_TIMES
 * unless it declares its own.
 */
const BATTLE_S = 3.4;
const BATTLE_TIMES = [0, 0.18, 0.3, 0.34, 0.42, 0.52, 0.56, 0.64, 0.76, 0.8, 1];
// px each cover lunges toward its rival on the three clashes (mirrored for the right side)
const LUNGE_X = [-180, 0, 0, 46, 0, 0, 46, 0, 0, 64, 26];
const LUNGE_EASES: Easing[] = [
  "easeOut", "linear", "easeIn", "easeOut", "linear",
  "easeIn", "easeOut", "linear", "easeIn", "easeOut",
];

const FLASH_TIMES = [0, 0.32, 0.36, 0.42, 0.54, 0.58, 0.64, 0.78, 0.84, 0.93, 1];
const FLASH_OPACITY = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0.6, 0.9];
const FLASH_SCALE = [0.4, 0.4, 1, 0.5, 0.5, 1.15, 0.5, 0.5, 1.7, 2.1, 2.8];

const SHAKE_TIMES = [0, 0.34, 0.355, 0.37, 0.385, 0.4, 0.56, 0.575, 0.59, 0.605, 0.62, 0.8, 0.815, 0.83, 0.845, 0.86, 1];
const SHAKE_X = [0, 0, 8, -7, 5, 0, 0, -9, 8, -5, 0, 0, 11, -10, 7, 0, 0];

// seconds at which the three impacts land, each burst bigger than the last
const IMPACTS = [
  { delay: 1.16, dist: 64, size: 5 },
  { delay: 1.9, dist: 78, size: 6 },
  { delay: 2.72, dist: 100, size: 7 },
];

// spell projectiles traded between the clashes
const BOLTS = [
  { side: "left" as const, top: "30%", delay: 1.35 },
  { side: "right" as const, top: "58%", delay: 1.55 },
  { side: "left" as const, top: "62%", delay: 2.08 },
  { side: "right" as const, top: "26%", delay: 2.28 },
];

function BattleCover({ data, side }: { data: PublicGrimoire; side: "left" | "right" }) {
  const color = ATTRIBUTE_STYLE[data.attribute].color;
  const sign = side === "left" ? 1 : -1;

  return (
    <motion.div
      className="relative w-[38%] max-w-[190px] shrink-0"
      initial={{ x: LUNGE_X[0] * sign }}
      animate={{ x: LUNGE_X.map((v) => v * sign) }}
      transition={{ duration: BATTLE_S, times: BATTLE_TIMES, ease: LUNGE_EASES }}
    >
      {/* mana aura in the mage's attribute color */}
      <motion.div
        className="absolute -inset-3 sm:-inset-5 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}59, transparent 70%)`, filter: "blur(16px)" }}
        animate={{ opacity: [0.3, 0.85, 0.3], scale: [1, 1.12, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative aspect-[3/4]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GrimoireCover data={data} />
      </motion.div>
      <p className="mt-3 text-center font-display text-xs sm:text-sm text-gold-bright truncate">
        {data.name ?? data.login}
      </p>
      <p className="text-center text-[0.6rem] tracking-widest uppercase" style={{ color }}>
        {data.attribute}
      </p>
    </motion.div>
  );
}

function SpellBolts({ colorA, colorB }: { colorA: string; colorB: string }) {
  return (
    <>
      {BOLTS.map((bolt, i) => {
        const color = bolt.side === "left" ? colorA : colorB;
        const from = bolt.side === "left" ? "22%" : "74%";
        const to = bolt.side === "left" ? "70%" : "26%";
        return (
          <motion.span
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
            style={{ top: bolt.top, background: color, boxShadow: `0 0 16px 5px ${color}66` }}
            initial={{ left: from, opacity: 0, scale: 0.5 }}
            animate={{ left: [from, to], opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1.15, 0.6] }}
            transition={{ delay: bolt.delay, duration: 0.42, ease: "easeIn" }}
          />
        );
      })}
    </>
  );
}

function ImpactBursts({ colorA, colorB }: { colorA: string; colorB: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* center flash that fires on every clash, escalating into the final burst */}
      <motion.div
        className="absolute w-36 h-36 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,223,160,0.95) 0%, rgba(232,196,104,0.4) 50%, transparent 75%)",
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: FLASH_OPACITY, scale: FLASH_SCALE }}
        transition={{ duration: BATTLE_S, times: FLASH_TIMES, ease: "easeOut" }}
      />
      {IMPACTS.map((burst, bi) =>
        Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2 + bi * 0.45;
          const color = i % 2 === 0 ? colorA : colorB;
          return (
            <motion.span
              key={`${bi}-${i}`}
              className="absolute rounded-full"
              style={{ width: burst.size, height: burst.size, background: color, boxShadow: `0 0 10px 2px ${color}88` }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                x: Math.cos(angle) * burst.dist,
                y: Math.sin(angle) * burst.dist,
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{ delay: burst.delay, duration: 0.55, ease: "easeOut" }}
            />
          );
        })
      )}
    </div>
  );
}

function DuelBattle({ a, b, onSkip }: { a: PublicGrimoire; b: PublicGrimoire; onSkip: () => void }) {
  const colorA = ATTRIBUTE_STYLE[a.attribute].color;
  const colorB = ATTRIBUTE_STYLE[b.attribute].color;

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-[0.65rem] tracking-[0.35em] uppercase text-foreground-muted">Duel Arena</p>
        <h1 className="font-display text-2xl sm:text-3xl text-shimmer glow-gold">
          {a.name ?? a.login} <span className="text-foreground-muted">vs</span> {b.name ?? b.login}
        </h1>
        <p className="text-xs text-foreground-muted uppercase tracking-[0.2em]">
          Grimoires drawn — the clash begins
        </p>
      </div>

      <motion.div
        className="relative w-full max-w-2xl"
        animate={{ x: SHAKE_X }}
        transition={{ duration: BATTLE_S, times: SHAKE_TIMES, ease: "linear" }}
      >
        <div className="flex items-start justify-center gap-10 sm:gap-20">
          <BattleCover data={a} side="left" />
          <BattleCover data={b} side="right" />
        </div>

        {/* VS sigil holds the center until the first clash */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1.4] }}
          transition={{ duration: BATTLE_S, times: [0, 0.18, 0.26, 0.32], ease: "easeOut" }}
        >
          <span className="font-display text-xl sm:text-2xl tracking-[0.2em] text-gold-bright/80">VS</span>
        </motion.div>

        <SpellBolts colorA={colorA} colorB={colorB} />
        <ImpactBursts colorA={colorA} colorB={colorB} />
      </motion.div>

      <button
        onClick={onSkip}
        className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-foreground-muted hover:text-gold-bright transition-colors cursor-pointer"
      >
        Skip the clash →
      </button>
    </div>
  );
}

function Combatant({
  data,
  side,
  isWinner,
  isDraw,
}: {
  data: PublicGrimoire;
  side: "left" | "right";
  isWinner: boolean;
  isDraw: boolean;
}) {
  const attribute = ATTRIBUTE_STYLE[data.attribute];
  const dimmed = !isDraw && !isWinner;

  return (
    <motion.div
      className="flex flex-col items-center gap-3 w-full max-w-[220px]"
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={{ opacity: dimmed ? 0.65 : 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {isWinner && (
        <span className="font-display text-[0.6rem] tracking-[0.3em] uppercase px-3 py-1 rounded-full bg-gold text-black glow-pulse">
          Winner
        </span>
      )}
      <div
        className="relative w-full aspect-[3/4]"
        style={{ filter: dimmed ? "grayscale(0.35)" : undefined }}
      >
        <div
          className="absolute -inset-1 rounded-r-xl rounded-l-sm pointer-events-none"
          style={{ boxShadow: isWinner ? "0 0 30px rgba(232,196,104,0.55)" : undefined }}
        />
        <GrimoireCover data={data} />
      </div>

      <Link
        href={`/grimoire/${data.login}`}
        className="text-center hover:opacity-80 transition-opacity"
      >
        <p className="font-display text-base text-gold-bright glow-gold">{data.name ?? data.login}</p>
        <p className="text-[0.65rem] text-foreground-muted tracking-widest uppercase">@{data.login}</p>
      </Link>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-xs" style={{ color: attribute.color }}>
          {data.attribute}
        </p>
        <p className="text-[0.65rem] text-foreground-muted">{data.rank}</p>
        <p className="text-[0.65rem] text-foreground-muted">{data.squad}</p>
      </div>

      <p className="font-display text-2xl text-gold-bright">
        {data.overall} <span className="text-xs text-foreground-muted">OVR</span>
      </p>
    </motion.div>
  );
}

export function DuelScene({ a, b, result }: { a: PublicGrimoire; b: PublicGrimoire; result: DuelResult }) {
  const [phase, setPhase] = useState<"battle" | "verdict">("battle");
  const [flash, setFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const isDraw = result.winner === "draw";
  const winnerData = result.winner === "a" ? a : result.winner === "b" ? b : null;

  const finishBattle = useCallback(() => {
    setFlash(true);
    setPhase("verdict");
  }, []);

  useEffect(() => {
    if (phase !== "battle") return;
    // Reduced-motion users get the verdict straight away, no theatrics.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("verdict");
      return;
    }
    const timer = setTimeout(finishBattle, BATTLE_S * 1000 + 150);
    return () => clearTimeout(timer);
  }, [phase, finishBattle]);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${a.login} vs ${b.login} — GitGrimoire Duel`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // user cancelled or share unsupported — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* burst of light that carries the cut from battle to verdict */}
      {flash && (
        <motion.div
          className="fixed inset-0 z-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(245,223,160,0.9), rgba(232,196,104,0.25) 45%, transparent 72%)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          onAnimationComplete={() => setFlash(false)}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "battle" ? (
          <motion.div
            key="battle"
            className="w-full flex flex-col items-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <DuelBattle a={a} b={b} onSkip={finishBattle} />
          </motion.div>
        ) : (
          <motion.div
            key="verdict"
            className="w-full flex flex-col items-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="font-display text-[0.65rem] tracking-[0.35em] uppercase text-foreground-muted">Duel Arena</p>
              <h1 className="font-display text-2xl sm:text-3xl text-shimmer glow-gold">
                {isDraw ? "A Perfectly Matched Duel" : duelVerdict(winnerData?.name ?? winnerData?.login ?? "", result.reason)}
              </h1>
              {!isDraw && (
                <p className="text-xs text-foreground-muted uppercase tracking-[0.2em]">
                  {result.reason}: {result.aScore.toLocaleString()} — {result.bScore.toLocaleString()}
                </p>
              )}
            </div>

            <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4">
              <Combatant data={a} side="left" isWinner={result.winner === "a"} isDraw={isDraw} />

              <motion.div
                className="shrink-0 font-display text-lg sm:text-xl tracking-[0.2em] text-gold-bright/80 px-4"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                VS
              </motion.div>

              <Combatant data={b} side="right" isWinner={result.winner === "b"} isDraw={isDraw} />
            </div>

            {/* Both combatants' real GitHub identities, side by side. */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GitHubIdentityCard login={a.login} name={a.name} avatarUrl={a.avatarUrl} />
              <GitHubIdentityCard login={b.login} name={b.name} avatarUrl={b.avatarUrl} />
            </div>

            <div className="w-full max-w-xl flex flex-col gap-2.5">
              {STAT_ROWS.map((row, i) => (
                <StatCompareBar
                  key={row.key}
                  label={row.label}
                  a={a.stats[row.key]}
                  b={b.stats[row.key]}
                  colorA={ATTRIBUTE_STYLE[a.attribute].color}
                  colorB={ATTRIBUTE_STYLE[b.attribute].color}
                  delay={i * 0.06}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleShare}
                className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full bg-gold text-black hover:bg-gold-bright transition-colors cursor-pointer"
              >
                {copied ? "Link Copied" : "Share Duel"}
              </button>
              <Link
                href="/duel"
                className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
              >
                New Duel
              </Link>
              <Link
                href="/leaderboard"
                className="font-display text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
