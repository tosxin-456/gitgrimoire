import type { PublicGrimoire } from "@/types/grimoire";

type MetricKey =
  | "totalCommits"
  | "currentStreak"
  | "longestStreak"
  | "followers"
  | "publicRepos"
  | "totalStars"
  | "totalForks"
  | "totalPRs"
  | "mergedPRs"
  | "closedIssues"
  | "organizations"
  | "accountAgeDays";

const SCOUTING_ROWS: Array<{ label: string; key: MetricKey }> = [
  { label: "Total Commits", key: "totalCommits" },
  { label: "Current Streak", key: "currentStreak" },
  { label: "Longest Streak", key: "longestStreak" },
  { label: "Followers", key: "followers" },
  { label: "Public Repos", key: "publicRepos" },
  { label: "Stars Received", key: "totalStars" },
  { label: "Forks", key: "totalForks" },
  { label: "Pull Requests", key: "totalPRs" },
  { label: "Merged PRs", key: "mergedPRs" },
  { label: "Issues Closed", key: "closedIssues" },
  { label: "Organizations", key: "organizations" },
  { label: "Account Age", key: "accountAgeDays" },
];

function formatValue(key: MetricKey, value: number): string {
  if (key === "accountAgeDays") {
    const years = value / 365;
    return years >= 1 ? `${years.toFixed(1)} yrs` : `${value} days`;
  }
  if (key === "currentStreak" || key === "longestStreak") return `${value} days`;
  return value.toLocaleString();
}

/**
 * The real-GitHub-deeds breakdown behind a grimoire: scouting report tiles,
 * top languages, and the kingdom's messages. Shared by the profile page and
 * the ceremony reveal.
 */
export function ScoutingReport({ grimoire }: { grimoire: PublicGrimoire }) {
  return (
    <>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-xs tracking-[0.3em] uppercase text-foreground-muted text-center">
            Scouting Report
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SCOUTING_ROWS.map((row) => (
              <div
                key={row.key}
                className="rounded-lg border border-white/10 bg-background-elevated/60 px-4 py-3 flex flex-col gap-1"
              >
                <span className="text-[0.6rem] tracking-[0.15em] uppercase text-foreground-muted">
                  {row.label}
                </span>
                <span className="font-display text-lg text-gold-bright">
                  {formatValue(row.key, grimoire[row.key])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {grimoire.languages.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-xs tracking-[0.3em] uppercase text-foreground-muted text-center">
              Top Languages
            </h2>
            {grimoire.languages.slice(0, 5).map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <span className="w-20 sm:w-24 text-xs text-foreground-muted truncate shrink-0">{lang.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.max(lang.percentage, 2)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-gold-bright tabular-nums shrink-0">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {grimoire.messages.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-2 text-center">
          {grimoire.messages.map((msg) => (
            <p key={msg} className="font-display italic text-sm text-foreground-muted">
              &ldquo;{msg}&rdquo;
            </p>
          ))}
        </div>
      )}
    </>
  );
}
