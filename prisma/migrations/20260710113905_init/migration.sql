-- CreateTable
CREATE TABLE "Grimoire" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Grimoire_login_key" ON "Grimoire"("login");

-- CreateIndex
CREATE INDEX "Grimoire_overall_idx" ON "Grimoire"("overall");

-- CreateIndex
CREATE INDEX "Grimoire_mana_idx" ON "Grimoire"("mana");

-- CreateIndex
CREATE INDEX "Grimoire_rank_idx" ON "Grimoire"("rank");
