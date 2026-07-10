export interface LanguageStat {
  name: string;
  bytes: number;
  repoCount: number;
  percentage: number;
}

export interface OrgStat {
  login: string;
  avatarUrl: string;
}

export interface GithubStats {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  createdAt: string;
  accountAgeDays: number;

  followers: number;
  following: number;
  publicRepos: number;

  totalStars: number;
  totalForks: number;

  languages: LanguageStat[];
  topics: string[];

  organizations: OrgStat[];

  totalPRs: number;
  mergedPRs: number;
  closedIssues: number;

  totalCommits: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
}
