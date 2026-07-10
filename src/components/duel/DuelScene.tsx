"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const isDraw = result.winner === "draw";
  const winnerData = result.winner === "a" ? a : result.winner === "b" ? b : null;

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
    <div className="w-full flex flex-col items-center gap-10">
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
    </div>
  );
}
