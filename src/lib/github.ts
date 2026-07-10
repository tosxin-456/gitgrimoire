import type { GithubStats, LanguageStat } from "@/types/github";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

export class GithubApiError extends Error {}
export class GithubUserNotFoundError extends GithubApiError {}

/** GitHub usernames: 1–39 alphanumeric chars or single hyphens, no leading/trailing hyphen. */
const GITHUB_LOGIN_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export function isValidGithubLogin(login: string): boolean {
  return GITHUB_LOGIN_RE.test(login);
}

function serverToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new GithubApiError(
      "GITHUB_TOKEN is not configured. Create a public-scope PAT and set it in the environment."
    );
  }
  return token;
}

interface GraphQLErrorEntry {
  type?: string;
  message: string;
}

async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serverToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new GithubApiError(`GitHub API responded ${res.status}`);
  }

  const json = await res.json();
  const errors = (json.errors ?? []) as GraphQLErrorEntry[];
  if (errors.length) {
    if (errors.some((e) => e.type === "NOT_FOUND")) {
      throw new GithubUserNotFoundError("No GitHub user with that username");
    }
    throw new GithubApiError(errors.map((e) => e.message).join("; "));
  }
  return json.data as T;
}

const PROFILE_QUERY = /* GraphQL */ `
  query ProfileStats($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: 100
        ownerAffiliations: [OWNER]
        isFork: false
        privacy: PUBLIC
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
      organizations(first: 25) {
        totalCount
        nodes {
          login
          avatarUrl
        }
      }
      allPRs: pullRequests {
        totalCount
      }
      mergedPRs: pullRequests(states: MERGED) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
    }
  }
`;

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ContributionsForWindow($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface ProfileQueryResult {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    createdAt: string;
    followers: { totalCount: number };
    following: { totalCount: number };
    repositories: {
      totalCount: number;
      nodes: Array<{
        name: string;
        stargazerCount: number;
        forkCount: number;
        primaryLanguage: { name: string } | null;
        languages: { edges: Array<{ size: number; node: { name: string } }> };
        repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
      }>;
    };
    organizations: {
      totalCount: number;
      nodes: Array<{ login: string; avatarUrl: string }>;
    };
    allPRs: { totalCount: number };
    mergedPRs: { totalCount: number };
    closedIssues: { totalCount: number };
  } | null;
}

interface ContributionsQueryResult {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{ date: string; contributionCount: number }>;
        }>;
      };
    };
  } | null;
}

function buildYearWindows(createdAt: Date, now: Date): Array<{ from: string; to: string }> {
  const windows: Array<{ from: string; to: string }> = [];
  let windowStart = new Date(createdAt);
  const MAX_WINDOWS = 20;

  while (windowStart < now && windows.length < MAX_WINDOWS) {
    const windowEnd = new Date(windowStart);
    windowEnd.setUTCFullYear(windowEnd.getUTCFullYear() + 1);
    const cappedEnd = windowEnd > now ? now : windowEnd;
    windows.push({ from: windowStart.toISOString(), to: cappedEnd.toISOString() });
    windowStart = cappedEnd;
  }

  return windows;
}

async function fetchWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function computeStreaks(dayMap: Map<string, number>): {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
} {
  const sortedDates = Array.from(dayMap.keys()).sort();
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDays: 0 };
  }

  let longestStreak = 0;
  let running = 0;
  let activeDays = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const count = dayMap.get(dateStr) ?? 0;
    const date = new Date(dateStr + "T00:00:00Z");

    if (count > 0) {
      activeDays++;
      if (prevDate) {
        const dayDiff = Math.round((date.getTime() - prevDate.getTime()) / 86400000);
        running = dayDiff === 1 ? running + 1 : 1;
      } else {
        running = 1;
      }
      longestStreak = Math.max(longestStreak, running);
      prevDate = date;
    } else {
      running = 0;
      prevDate = date;
    }
  }

  // Current streak: walk backward from today (or yesterday, if today has no
  // data yet) while days remain consecutive and non-zero.
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  let cursorDate = dayMap.has(todayKey) && (dayMap.get(todayKey) ?? 0) === 0
    ? new Date(today.getTime() - 86400000)
    : today;

  let currentStreak = 0;
  for (;;) {
    const key = cursorDate.toISOString().slice(0, 10);
    const count = dayMap.get(key);
    if (count === undefined || count === 0) break;
    currentStreak++;
    cursorDate = new Date(cursorDate.getTime() - 86400000);
  }

  return { currentStreak, longestStreak, activeDays };
}

/** Fetch public GitHub stats for any username — no user OAuth needed, gitfut-style. */
export async function fetchGithubStats(login: string): Promise<GithubStats> {
  if (!isValidGithubLogin(login)) {
    throw new GithubUserNotFoundError("Not a valid GitHub username");
  }

  const profileData = await githubGraphQL<ProfileQueryResult>(PROFILE_QUERY, { login });
  const user = profileData.user;
  if (!user) {
    throw new GithubUserNotFoundError("No GitHub user with that username");
  }

  const createdAt = new Date(user.createdAt);
  const now = new Date();
  const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / 86400000);

  let totalStars = 0;
  let totalForks = 0;
  const languageBytes = new Map<string, number>();
  const languageRepoCount = new Map<string, number>();
  const topicsSet = new Set<string>();

  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      languageBytes.set(name, (languageBytes.get(name) ?? 0) + edge.size);
      languageRepoCount.set(name, (languageRepoCount.get(name) ?? 0) + 1);
    }
    for (const node of repo.repositoryTopics.nodes) {
      topicsSet.add(node.topic.name.toLowerCase());
    }
  }

  const totalBytes = Array.from(languageBytes.values()).reduce((a, b) => a + b, 0) || 1;
  const languages: LanguageStat[] = Array.from(languageBytes.entries())
    .map(([name, bytes]) => ({
      name,
      bytes,
      repoCount: languageRepoCount.get(name) ?? 0,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const windows = buildYearWindows(createdAt, now);
  const contributionResults = await fetchWithConcurrencyLimit(windows, 4, (window) =>
    githubGraphQL<ContributionsQueryResult>(CONTRIBUTIONS_QUERY, { login, ...window })
  );

  let totalCommits = 0;
  let totalContributions = 0;
  const dayMap = new Map<string, number>();

  for (const result of contributionResults) {
    const collection = result.user?.contributionsCollection;
    if (!collection) continue;
    totalCommits += collection.totalCommitContributions;
    totalContributions += collection.contributionCalendar.totalContributions;
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap.set(day.date, (dayMap.get(day.date) ?? 0) + day.contributionCount);
      }
    }
  }

  const { currentStreak, longestStreak, activeDays } = computeStreaks(dayMap);

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
    accountAgeDays,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    publicRepos: user.repositories.totalCount,
    totalStars,
    totalForks,
    languages,
    topics: Array.from(topicsSet),
    organizations: user.organizations.nodes,
    totalPRs: user.allPRs.totalCount,
    mergedPRs: user.mergedPRs.totalCount,
    closedIssues: user.closedIssues.totalCount,
    totalCommits,
    totalContributions,
    currentStreak,
    longestStreak,
    activeDays,
  };
}
