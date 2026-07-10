import type { GithubStats } from "@/types/github";
import type { MagicAttribute } from "@/types/grimoire";

const SECURITY_TOPICS = [
  "security", "pentest", "penetration-testing", "cryptography", "crypto",
  "vulnerability", "exploit", "ctf", "infosec", "encryption", "malware",
  "reverse-engineering", "hacking",
];

const ML_TOPICS = [
  "machine-learning", "deep-learning", "neural-network", "artificial-intelligence",
  "tensorflow", "pytorch", "nlp", "computer-vision", "data-science", "llm",
  "generative-ai", "ai",
];

const GAME_TOPICS = [
  "game", "game-development", "gamedev", "unity", "unreal-engine", "godot",
  "game-engine", "game-jam",
];

const MOBILE_TOPICS = [
  "android", "ios", "flutter", "react-native", "mobile", "mobile-app",
  "swiftui", "jetpack-compose",
];

const BACKEND_TOPICS = [
  "backend", "api", "microservices", "server", "database", "rest-api",
  "graphql-api", "distributed-systems",
];

const LANGUAGE_ATTRIBUTE: Record<string, MagicAttribute> = {
  JavaScript: "Lightning Magic",
  TypeScript: "Time Magic",
  Rust: "Steel Magic",
  Go: "Wind Magic",
  Python: "Spatial Magic",
  "C++": "Earth Magic",
  C: "Earth Magic",
  Java: "Water Magic",
  Kotlin: "Water Magic",
  Swift: "Flame Magic",
  Dart: "Flame Magic",
  Ruby: "Water Magic",
  PHP: "Water Magic",
  "C#": "Water Magic",
};

function topicMatchScore(topics: string[], keywords: string[]): number {
  const set = new Set(topics);
  return keywords.reduce((score, keyword) => score + (set.has(keyword) ? 1 : 0), 0);
}

export function computeMagicAttribute(stats: GithubStats): MagicAttribute {
  const topics = stats.topics;

  const categoryScores: Array<[MagicAttribute, number]> = [
    ["Dark Magic", topicMatchScore(topics, SECURITY_TOPICS)],
    ["Dream Magic", topicMatchScore(topics, ML_TOPICS)],
    ["Creation Magic", topicMatchScore(topics, GAME_TOPICS)],
    ["Flame Magic", topicMatchScore(topics, MOBILE_TOPICS)],
    ["Water Magic", topicMatchScore(topics, BACKEND_TOPICS)],
  ];

  const bestCategory = categoryScores.reduce((best, current) =>
    current[1] > best[1] ? current : best
  );

  if (bestCategory[1] > 0) {
    return bestCategory[0];
  }

  const languages = stats.languages;
  if (languages.length === 0) {
    return "World Tree Magic";
  }

  const topLanguage = languages[0];
  const significantLanguages = languages.filter((lang) => lang.percentage >= 10);

  // A true generalist: no language dominates and several are well-represented.
  if (topLanguage.percentage < 35 && significantLanguages.length >= 4) {
    return "World Tree Magic";
  }

  return LANGUAGE_ATTRIBUTE[topLanguage.name] ?? "World Tree Magic";
}
