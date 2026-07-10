import { AttributeGlyph } from "@/components/grimoire/AttributeGlyph";
import { CloverEmblem } from "@/components/grimoire/CloverEmblem";
import { RuneCircle } from "@/components/visual/RuneCircle";
import { isFounder } from "@/lib/founder";
import { ATTRIBUTE_STYLE, BLACK_CLOVER_STYLE, RARITY_STYLE } from "@/lib/data/presentation";
import type { GrimoireBookData } from "@/types/grimoire";

export function GrimoireCover({ data }: { data: GrimoireBookData }) {
  const founder = isFounder(data.login);
  const rarity = founder ? BLACK_CLOVER_STYLE : RARITY_STYLE[data.rarity];
  const attribute = ATTRIBUTE_STYLE[data.attribute];
  // Strokes/labels need to stay visible on dark leather even when the clover
  // itself is jet black — accent covers that case.
  const accent = rarity.accent ?? rarity.primary;
  const background =
    rarity.cover ??
    `linear-gradient(155deg, ${rarity.secondary} 0%, #0b0810 55%, ${rarity.secondary} 130%)`;

  return (
    <div
      className="relative w-full h-full rounded-r-xl rounded-l-sm overflow-hidden select-none"
      style={{
        background,
        boxShadow: `inset 0 0 0 1px ${accent}55, inset 0 0 40px ${rarity.glow}, 0 20px 60px rgba(0,0,0,0.6)`,
      }}
    >
      {/* spine shadow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-4"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.6), transparent)" }}
      />

      {/* ornate border */}
      <div
        className="absolute inset-3 rounded-r-lg rounded-l-sm pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${accent}70` }}
      />
      <div
        className="absolute inset-5 rounded-r-md rounded-l-sm pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}40` }}
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <RuneCircle size={280} className="rune-ring-slow" color={accent} opacity={0.4} />
      </div>

      <div className="relative h-full flex flex-col items-center justify-between py-8 sm:py-10 px-4">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: `${attribute.color}1a`, color: attribute.color, boxShadow: `0 0 12px ${attribute.color}55` }}
        >
          <AttributeGlyph attribute={data.attribute} size={16} />
          <span className="font-display text-[0.65rem] tracking-[0.2em] uppercase">{data.attribute}</span>
        </div>

        <div
          className={`glow-pulse rounded-full ${rarity.halo ? "p-4" : ""}`}
          style={{ boxShadow: `0 0 40px ${rarity.glow}`, background: rarity.halo }}
        >
          <CloverEmblem
            leafCount={rarity.leafCount}
            size={104}
            color={rarity.primary}
            outline={rarity.emblemOutline}
          />
        </div>

        <div className="text-center">
          <p className="font-display text-lg sm:text-xl text-gold-bright glow-gold tracking-wide">
            {data.name ?? data.login}
          </p>
          <p className="text-xs text-foreground-muted mt-1 tracking-widest uppercase">@{data.login}</p>
          <p className="mt-3 text-[0.65rem] tracking-[0.25em] uppercase" style={{ color: accent }}>
            {rarity.label}
          </p>
          {founder && (
            <p className="mt-1 text-[0.6rem] tracking-[0.3em] uppercase font-semibold" style={{ color: accent }}>
              Founder
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
