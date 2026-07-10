import { GrimoireCover } from "@/components/grimoire/GrimoireCover";
import type { GrimoireBookData } from "@/types/grimoire";

/**
 * Dev-only gallery: renders the clover-tier covers with mock data so the
 * cover art can be reviewed without summoning real grimoires.
 * Not linked from anywhere — visit /dev/covers directly.
 */

const baseStats = {
  mana: 90,
  spellMastery: 88,
  battleExperience: 85,
  leadership: 80,
  control: 86,
  potential: 92,
};

const fourLeaf: GrimoireBookData = {
  login: "golden-dawn-demo",
  name: "Yuno",
  avatarUrl: "",
  attribute: "Wind Magic",
  rank: "Grand Magic Knight",
  squad: "Golden Dawn",
  rarity: "Four-Leaf",
  overall: 94,
  stats: baseStats,
  messages: [],
};

const fiveLeaf: GrimoireBookData = {
  login: "tosxin-456",
  name: "Ekundayo Tosin",
  avatarUrl: "",
  attribute: "Anti Magic",
  rank: "Grand Magic Knight",
  squad: "Black Bulls",
  rarity: "Five-Leaf",
  overall: 96,
  stats: baseStats,
  messages: [],
};

const threeLeaf: GrimoireBookData = {
  login: "clover-demo",
  name: "Magic Knight",
  avatarUrl: "",
  attribute: "Water Magic",
  rank: "Senior Magic Knight",
  squad: "Azure Deer",
  rarity: "Three-Leaf",
  overall: 87,
  stats: baseStats,
  messages: [],
};

export default function CoversPreviewPage() {
  return (
    <main className="min-h-screen flex flex-wrap items-center justify-center gap-10 px-6 py-14">
      {/* freeze animations so the gallery is stable for review/screenshots */}
      <style>{`*{animation:none!important;transition:none!important}`}</style>
      {[threeLeaf, fourLeaf, fiveLeaf].map((data) => (
        <div key={data.login} className="flex flex-col items-center gap-3">
          <div className="w-64 h-[400px]">
            <GrimoireCover data={data} />
          </div>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-foreground-muted">
            {data.rarity}
          </p>
        </div>
      ))}
    </main>
  );
}
