import { SQUAD_STYLE } from "@/lib/data/presentation";
import { cn } from "@/lib/utils";
import type { Squad } from "@/types/grimoire";

export function SquadEmblem({ squad, className }: { squad: Squad; className?: string }) {
  const style = SQUAD_STYLE[squad];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="block w-3 h-3 rotate-45 rounded-[2px] shrink-0"
        style={{ background: style.color, boxShadow: `0 0 10px ${style.color}99` }}
      />
      <div className="flex flex-col leading-tight">
        <span className="font-display text-xs sm:text-sm text-[#241a10]">{squad}</span>
        <span className="text-[0.55rem] sm:text-[0.65rem] text-[#241a10]/60 italic">{style.tagline}</span>
      </div>
    </div>
  );
}
