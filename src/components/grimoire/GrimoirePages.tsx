import Image from "next/image";
import { AttributeGlyph } from "@/components/grimoire/AttributeGlyph";
import { CloverEmblem } from "@/components/grimoire/CloverEmblem";
import { RankBadge } from "@/components/grimoire/RankBadge";
import { SquadEmblem } from "@/components/grimoire/SquadEmblem";
import { StatRune } from "@/components/grimoire/StatRune";
import { ATTRIBUTE_STYLE, BLACK_CLOVER_STYLE, RARITY_STYLE } from "@/lib/data/presentation";
import { isFounder } from "@/lib/founder";
import type { GrimoireBookData } from "@/types/grimoire";

const PAGE_BG =
  "radial-gradient(ellipse at top left, rgba(232,196,104,0.06), transparent 55%), linear-gradient(160deg, #efe6d0 0%, #e4d8ba 100%)";

const STAT_ROWS: Array<{ key: keyof GrimoireBookData["stats"]; label: string }> = [
  { key: "mana", label: "Mana" },
  { key: "spellMastery", label: "Spell Mastery" },
  { key: "battleExperience", label: "Battle Experience" },
  { key: "leadership", label: "Leadership" },
  { key: "control", label: "Control" },
  { key: "potential", label: "Potential" },
];

export function GrimoirePages({ data }: { data: GrimoireBookData }) {
  const founder = isFounder(data.login);
  const rarity = founder ? BLACK_CLOVER_STYLE : RARITY_STYLE[data.rarity];
  const attribute = ATTRIBUTE_STYLE[data.attribute];
  const message = data.messages[0] ?? "Your mana continues to grow.";

  return (
    <div className="w-full h-full flex flex-col sm:flex-row rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      {/* Left / top page */}
      <div
        className="relative w-full h-1/2 sm:w-1/2 sm:h-full px-4 py-3 sm:px-8 sm:py-8 flex flex-col items-center justify-center gap-1.5 sm:gap-4 text-[#241a10] overflow-y-auto"
        style={{ background: PAGE_BG, boxShadow: "inset 0 -12px 24px -18px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute inset-2 sm:inset-3 rounded-lg border border-[#8a713a]/30 pointer-events-none" />

        <div
          className="relative w-12 h-12 sm:w-28 sm:h-28 rounded-full p-1 shrink-0"
          style={{ background: `conic-gradient(${rarity.primary}, ${attribute.color}, ${rarity.primary})` }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-black/20 relative">
            <Image src={data.avatarUrl} alt={data.login} fill sizes="112px" className="object-cover" unoptimized />
          </div>
        </div>

        <div className="text-center">
          <p className="font-display text-xs sm:text-xl font-semibold tracking-wide">
            {data.name ?? data.login}
          </p>
          <p className="text-[0.55rem] sm:text-xs opacity-60 tracking-widest uppercase">@{data.login}</p>
          {founder && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#17121c] text-[#e4d8ba] text-[0.5rem] sm:text-[0.6rem] font-display tracking-[0.25em] uppercase">
              Founder
            </span>
          )}
        </div>

        <RankBadge rank={data.rank} className="scale-75 sm:scale-100" />
        <SquadEmblem squad={data.squad} className="text-center flex-col items-center" />

        <div className="flex items-center gap-1.5 text-[0.65rem] sm:text-sm" style={{ color: attribute.color }}>
          <AttributeGlyph attribute={data.attribute} size={14} />
          <span className="font-display tracking-wide">{data.attribute}</span>
        </div>
      </div>

      {/* Spine crease */}
      <div
        className="h-2 w-full sm:h-full sm:w-2 shrink-0"
        style={{ background: "rgba(0,0,0,0.35)", boxShadow: "0 0 12px rgba(0,0,0,0.3)" }}
      />

      {/* Right / bottom page */}
      <div
        className="relative w-full h-1/2 sm:w-1/2 sm:h-full px-4 py-3 sm:px-8 sm:py-8 flex flex-col justify-between text-[#241a10] overflow-y-auto"
        style={{ background: PAGE_BG, boxShadow: "inset 0 12px 24px -18px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute inset-2 sm:inset-3 rounded-lg border border-[#8a713a]/30 pointer-events-none" />

        <div className="flex items-start justify-between">
          <p className="font-display text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] uppercase opacity-60">Grimoire Record</p>
          <div className="flex flex-col items-end">
            <span className="font-display text-lg sm:text-4xl font-bold" style={{ color: rarity.primary }}>
              {data.overall}
            </span>
            <span className="text-[0.5rem] sm:text-[0.6rem] tracking-[0.2em] uppercase opacity-60">OVR</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2.5">
          {STAT_ROWS.map((row, i) => (
            <StatRune
              key={row.key}
              label={row.label}
              value={data.stats[row.key]}
              delay={i * 0.08}
              color={rarity.primary}
            />
          ))}
        </div>

        <div className="flex items-end justify-between gap-3">
          <p className="font-display italic text-[0.6rem] sm:text-xs opacity-70 max-w-[65%] leading-snug">
            &ldquo;{message}&rdquo;
          </p>
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <CloverEmblem leafCount={rarity.leafCount} size={32} color={rarity.primary} className="sm:hidden" />
            <CloverEmblem leafCount={rarity.leafCount} size={44} color={rarity.primary} className="hidden sm:block" />
            <span
              className="font-display text-[0.5rem] sm:text-[0.6rem] tracking-[0.15em] uppercase whitespace-nowrap"
              style={{ color: rarity.primary }}
            >
              {founder ? "Black Clover" : rarity.leafCount > 0 ? `${rarity.leafCount}-Leaf` : rarity.label.replace(" Grimoire", "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
