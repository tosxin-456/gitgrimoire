import { NextResponse } from "next/server";
import { GithubUserNotFoundError, isValidGithubLogin } from "@/lib/github";
import { promotionMessage } from "@/lib/scoring/rank";
import { summonGrimoire } from "@/lib/summon";

export async function POST(request: Request) {
  let login: string;
  try {
    const body = await request.json();
    login = String(body?.login ?? "").trim().replace(/^@/, "");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!login || !isValidGithubLogin(login)) {
    return NextResponse.json({ error: "That is not a valid GitHub username" }, { status: 400 });
  }

  try {
    const { grimoire, promoted, previousRank } = await summonGrimoire(login);

    return NextResponse.json({
      grimoire,
      promoted,
      promotionMessage: promoted ? promotionMessage(grimoire.rank) : null,
      previousRank,
    });
  } catch (error) {
    if (error instanceof GithubUserNotFoundError) {
      return NextResponse.json(
        { error: "No mage by that name exists in the kingdom's records" },
        { status: 404 }
      );
    }
    console.error("Failed to compute grimoire", error);
    return NextResponse.json({ error: "Failed to reach the GitHub API" }, { status: 502 });
  }
}
