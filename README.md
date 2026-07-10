# GitGrimoire 🍀

Type any GitHub username and receive a Grimoire, forged from real commits, streaks, pull requests, and stars — a Black Clover-inspired Magic Knight profile for developers. No sign-in, no OAuth — just a username, gitfut-style.

## Setup

### 1. Create a GitHub token (server-side)

The app reads **public** profile data through the GitHub GraphQL API, which requires a token on the server (visitors never authorize anything).

Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)** → select **no scopes** (public data only). Copy it.

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```bash
GITHUB_TOKEN=your_server_side_token
```

`DATABASE_URL` is already set to a local SQLite file — no extra setup needed.

On Vercel, set `GITHUB_TOKEN` (plus `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`) in the project's Environment Variables and redeploy.

### 3. Install and run

```bash
npm install
npx prisma migrate dev   # first time only, creates prisma/dev.db
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- **Summoning** — type a GitHub username on the landing page; no login required. The server does the rest.
- **GitHub data** — `src/lib/github.ts` queries the GitHub GraphQL API (`user(login:)` field) for profile, repo, language, and organization data, plus a year-by-year `contributionsCollection` loop to compute all-time commit totals and contribution streaks.
- **Scoring engine** — `src/lib/scoring/` turns raw GitHub stats into:
  - Six 1–99 card stats (Mana, Spell Mastery, Battle Experience, Leadership, Control, Potential)
  - An Overall Rating (50–99)
  - A Magic Attribute (based on languages/topics)
  - A Magic Knight Rank (Unranked → Wizard King)
  - A Squad (based on development style)
  - A Grimoire Rarity (Common → Five-Leaf, with Five-Leaf deliberately rare)
  - Dynamic flavor messages
- **Persistence** — results are stored in SQLite via Prisma (`prisma/schema.prisma`) so profiles and leaderboards persist.
- **The Ceremony** (`/ceremony?user=<login>`) — a cinematic, multi-phase reveal sequence: fade to black → wind/particles → runes → the grimoire flies in and hovers → pages turn → light floods the screen → the book opens with the freshly computed Grimoire.
- **The Grimoire** (`src/components/grimoire/GrimoireBook.tsx`) — an interactive 3D book, not a flat card: a closed cover styled by rarity/attribute that flips open (via Framer Motion + CSS 3D transforms) into a two-page spread with the avatar, rank, squad, attribute, stats, and rarity. Exportable as a PNG via `html-to-image` for sharing.
- **Leaderboards** (`/leaderboard`) — Top Mana, Top Captains, Wizard King Candidates, Highest Overall, Longest Streak, and Most Powerful Grimoires.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma + SQLite
# gitgrimoire
# gitgrimoire
