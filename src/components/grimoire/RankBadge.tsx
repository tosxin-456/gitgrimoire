import { RANK_STYLE } from "@/lib/data/presentation";
import { cn } from "@/lib/utils";
import type { MagicRank } from "@/types/grimoire";

export function RankBadge({ rank, className }: { rank: MagicRank; className?: string }) {
  const tier = RANK_STYLE[rank].tier;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex gap-[2px]">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="block w-[3px] h-3 rounded-full"
            style={{
              background: i < tier ? "var(--gold-dim)" : "rgba(36,26,16,0.15)",
            }}
          />
        ))}
      </div>
      <span className="font-display text-xs sm:text-sm tracking-wide text-[#241a10]">{rank}</span>
    </div>
  );
}
