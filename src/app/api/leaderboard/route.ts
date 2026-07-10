import { NextResponse } from "next/server";
import { getLeaderboards } from "@/lib/leaderboard";

export async function GET() {
  const leaderboards = await getLeaderboards();
  return NextResponse.json(leaderboards);
}
