-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Grimoire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "squad" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "mana" INTEGER NOT NULL,
    "spellMastery" INTEGER NOT NULL,
    "battleExperience" INTEGER NOT NULL,
    "leadership" INTEGER NOT NULL,
    "control" INTEGER NOT NULL,
    "potential" INTEGER NOT NULL,
    "totalCommits" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL,
    "longestStreak" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "publicRepos" INTEGER NOT NULL,
    "totalStars" INTEGER NOT NULL,
    "totalForks" INTEGER NOT NULL,
    "totalPRs" INTEGER NOT NULL,
    "mergedPRs" INTEGER NOT NULL,
    "closedIssues" INTEGER NOT NULL,
    "organizations" INTEGER NOT NULL,
    "accountAgeDays" INTEGER NOT NULL,
    "previousRank" TEXT,
    "messages" TEXT NOT NULL DEFAULT '[]',
    "topLanguage" TEXT,
    "languagesJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Grimoire" ("accountAgeDays", "attribute", "avatarUrl", "battleExperience", "closedIssues", "control", "createdAt", "currentStreak", "followers", "id", "leadership", "login", "longestStreak", "mana", "mergedPRs", "messages", "name", "organizations", "overall", "potential", "previousRank", "publicRepos", "rank", "rarity", "spellMastery", "squad", "totalCommits", "totalForks", "totalPRs", "totalStars", "updatedAt") SELECT "accountAgeDays", "attribute", "avatarUrl", "battleExperience", "closedIssues", "control", "createdAt", "currentStreak", "followers", "id", "leadership", "login", "longestStreak", "mana", "mergedPRs", "messages", "name", "organizations", "overall", "potential", "previousRank", "publicRepos", "rank", "rarity", "spellMastery", "squad", "totalCommits", "totalForks", "totalPRs", "totalStars", "updatedAt" FROM "Grimoire";
DROP TABLE "Grimoire";
ALTER TABLE "new_Grimoire" RENAME TO "Grimoire";
CREATE UNIQUE INDEX "Grimoire_login_key" ON "Grimoire"("login");
CREATE INDEX "Grimoire_overall_idx" ON "Grimoire"("overall");
CREATE INDEX "Grimoire_mana_idx" ON "Grimoire"("mana");
CREATE INDEX "Grimoire_rank_idx" ON "Grimoire"("rank");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
