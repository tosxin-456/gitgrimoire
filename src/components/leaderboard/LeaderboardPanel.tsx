import Link from "next/link";
import Image from "next/image";
import { RARITY_STYLE } from "@/lib/data/presentation";
import type { PublicGrimoire } from "@/types/grimoire";

interface LeaderboardPanelProps {
  title: string;
  description: string;
  entries: PublicGrimoire[];
  valueLabel: string;
  getValue: (entry: PublicGrimoire) => string | number;
}

export function LeaderboardPanel({ title, description, entries, valueLabel, getValue }: LeaderboardPanelProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-background-elevated/60 p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg text-gold-bright tracking-wide">{title}</h2>
        <p className="text-xs text-foreground-muted mt-0.5">{description}</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-foreground-muted italic">No grimoires have qualified yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry, index) => {
            const rarity = RARITY_STYLE[entry.rarity];
            return (
              <li key={entry.login}>
                <Link
                  href={`/grimoire/${entry.login}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <span className="font-display text-sm w-5 text-right text-foreground-muted">{index + 1}</span>
                  <span className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1" style={{ boxShadow: `0 0 0 1px ${rarity.accent ?? rarity.primary}` }}>
                    <Image src={entry.avatarUrl} alt={entry.login} fill sizes="32px" className="object-cover" unoptimized />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-foreground truncate">{entry.name ?? entry.login}</span>
                    <span className="block text-[0.65rem] text-foreground-muted truncate">@{entry.login}</span>
                  </span>
                  <span className="font-display text-sm text-gold-bright shrink-0">
                    {getValue(entry)}
                    <span className="text-[0.6rem] text-foreground-muted ml-1 uppercase">{valueLabel}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
