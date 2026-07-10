import type { GrimoireRarity, MagicAttribute, MagicRank, Squad } from "@/types/grimoire";

export interface RarityStyle {
  label: string;
  leafCount: number;
  primary: string;
  secondary: string;
  glow: string;
  description: string;
  /** Full CSS background for the closed cover; falls back to the standard dark gradient. */
  cover?: string;
  /** Readable accent for text/strokes on dark backgrounds when `primary` is too dark. */
  accent?: string;
  /** Lit disc painted behind the cover emblem so a dark clover stays distinct. */
  halo?: string;
  /** Rim-light stroke around the emblem's leaves, for dark-on-dark separation. */
  emblemOutline?: string;
}

export const RARITY_STYLE: Record<GrimoireRarity, RarityStyle> = {
  Common: {
    label: "Common Grimoire",
    leafCount: 0,
    primary: "#8a8a94",
    secondary: "#5a5a63",
    glow: "rgba(138,138,148,0.35)",
    description: "A plain grimoire, its cover still waiting to be defined.",
  },
  Bronze: {
    label: "Bronze Grimoire",
    leafCount: 0,
    primary: "#b0703c",
    secondary: "#7a4b26",
    glow: "rgba(176,112,60,0.4)",
    description: "Forged from steady, dependable work.",
  },
  Silver: {
    label: "Silver Grimoire",
    leafCount: 0,
    primary: "#c7c9d6",
    secondary: "#8d8fa0",
    glow: "rgba(199,201,214,0.45)",
    description: "A polished cover, catching the light of real progress.",
  },
  Gold: {
    label: "Gold Grimoire",
    leafCount: 0,
    primary: "#e8c15a",
    secondary: "#a9822f",
    glow: "rgba(232,193,90,0.5)",
    description: "Gilded by consistency and craft.",
  },
  "Three-Leaf": {
    label: "Three-Leaf Grimoire",
    leafCount: 3,
    primary: "#45c47a",
    secondary: "#1f7a48",
    glow: "rgba(69,196,122,0.55)",
    description: "A clover grimoire — a sign of rare, growing talent.",
  },
  // Yuno's book: mossy watercolor green, gold filigree, gold clover.
  "Four-Leaf": {
    label: "Four-Leaf Grimoire",
    leafCount: 4,
    primary: "#e6cf7a",
    secondary: "#42541f",
    glow: "rgba(230,207,122,0.5)",
    accent: "#d9c05a",
    cover:
      "radial-gradient(ellipse at 28% 22%, rgba(214,226,150,0.28), transparent 55%), radial-gradient(ellipse at 72% 75%, rgba(30,44,12,0.55), transparent 60%), linear-gradient(155deg, #75864a 0%, #56682f 45%, #42541f 100%)",
    description: "Exceedingly rare. Few are chosen by a grimoire like this.",
  },
  // Asta's book: scorched near-black leather, an ember halo, a jet-black clover.
  "Five-Leaf": {
    label: "Five-Leaf Grimoire",
    leafCount: 5,
    primary: "#0b0709",
    secondary: "#1c1008",
    glow: "rgba(201,116,50,0.55)",
    accent: "#c9743a",
    cover:
      "radial-gradient(circle at 50% 42%, rgba(206,126,56,0.45), rgba(130,68,28,0.18) 45%, transparent 70%), radial-gradient(ellipse at 18% 82%, rgba(90,45,18,0.35), transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(70,35,14,0.3), transparent 50%), linear-gradient(155deg, #241309 0%, #170d06 50%, #1f1207 100%)",
    halo: "radial-gradient(circle, rgba(226,146,70,0.62) 0%, rgba(178,100,44,0.38) 48%, transparent 74%)",
    emblemOutline: "rgba(236,166,96,0.5)",
    description: "A grimoire spoken of only in legend.",
  },
};

/**
 * The founder's grimoire — Asta's five-leaf, with its own title. Same scorched
 * cover as the Five-Leaf tier; only the label and description differ.
 */
export const BLACK_CLOVER_STYLE: RarityStyle = {
  ...RARITY_STYLE["Five-Leaf"],
  label: "The Black Clover",
  description: "The five-leaf grimoire of the founder — a devil dwells within.",
};

export const SQUAD_STYLE: Record<Squad, { color: string; secondary: string; tagline: string }> = {
  "Black Bulls": { color: "#3a3a42", secondary: "#e8c468", tagline: "Misfits with unmatched range." },
  "Golden Dawn": { color: "#e8c15a", secondary: "#2a2410", tagline: "The kingdom's elite." },
  "Crimson Lion": { color: "#b8232f", secondary: "#f2d9b0", tagline: "Discipline and iron leadership." },
  "Silver Eagles": { color: "#a8b3c4", secondary: "#20242c", tagline: "Precision above all." },
  "Blue Rose": { color: "#d187b5", secondary: "#3a1c30", tagline: "Grace, versatility, and craft." },
  "Green Mantis": { color: "#5fae5a", secondary: "#16240f", tagline: "Calculated, strategic strikes." },
  "Coral Peacock": { color: "#e8845f", secondary: "#2a1810", tagline: "Beloved, brilliant, unmissable." },
  "Purple Orca": { color: "#7a4fc4", secondary: "#150a2a", tagline: "Ambitious underdogs on the rise." },
  "Azure Deer": { color: "#5b8fc4", secondary: "#101d2a", tagline: "The kingdom's quiet backbone." },
};

export const RANK_STYLE: Record<MagicRank, { tier: number }> = {
  Unranked: { tier: 0 },
  "Junior Magic Knight": { tier: 1 },
  "Intermediate Magic Knight": { tier: 2 },
  "Senior Magic Knight": { tier: 3 },
  "Vice Captain": { tier: 4 },
  Captain: { tier: 5 },
  "Grand Magic Knight": { tier: 6 },
  "Wizard King Candidate": { tier: 7 },
  "Wizard King": { tier: 8 },
};

export const ATTRIBUTE_STYLE: Record<MagicAttribute, { color: string; secondary: string }> = {
  "Anti Magic": { color: "#b03040", secondary: "#0d0a12" },
  "Lightning Magic": { color: "#f5d94e", secondary: "#5a4e10" },
  "Time Magic": { color: "#7fd8d0", secondary: "#123a38" },
  "Steel Magic": { color: "#b9c2cc", secondary: "#2c3238" },
  "Wind Magic": { color: "#9fe6a0", secondary: "#1e3a1f" },
  "Spatial Magic": { color: "#b28cf0", secondary: "#2a1a4a" },
  "Earth Magic": { color: "#c98b4a", secondary: "#3a2413" },
  "Dark Magic": { color: "#9260c9", secondary: "#12081f" },
  "Dream Magic": { color: "#e6a0d0", secondary: "#3a1830" },
  "Creation Magic": { color: "#f0a24e", secondary: "#3a2210" },
  "Water Magic": { color: "#5fa8e6", secondary: "#0f2438" },
  "Flame Magic": { color: "#f0603f", secondary: "#3a1208" },
  "World Tree Magic": { color: "#5fc47a", secondary: "#123a1f" },
};
