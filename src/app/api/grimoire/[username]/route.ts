import { NextResponse } from "next/server";
import { toPublicGrimoire } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const record = await prisma.grimoire.findUnique({
    where: { login: username },
  });

  if (!record) {
    return NextResponse.json({ error: "Grimoire not found" }, { status: 404 });
  }

  return NextResponse.json({ grimoire: toPublicGrimoire(record) });
}
