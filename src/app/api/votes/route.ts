import { NextRequest, NextResponse } from "next/server";
import { saveVotes, getVotes } from "@/lib/redis";
import { FAMILY_MEMBERS, FamilyMember } from "@/lib/types";
import { destinations } from "@/lib/destinations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { familyMember, votes } = body as {
    familyMember: string;
    votes: Record<string, number>;
  };

  if (!FAMILY_MEMBERS.includes(familyMember as FamilyMember)) {
    return NextResponse.json(
      { error: "Ismeretlen családtag" },
      { status: 400 },
    );
  }

  const destinationIds = destinations.map((d) => d.id);
  for (const [id, score] of Object.entries(votes)) {
    if (!destinationIds.includes(id)) {
      return NextResponse.json(
        { error: `Ismeretlen célállomás: ${id}` },
        { status: 400 },
      );
    }
    if (typeof score !== "number" || score < 1 || score > 10) {
      return NextResponse.json(
        { error: `Érvénytelen pontszám: ${score}` },
        { status: 400 },
      );
    }
  }

  await saveVotes(familyMember, votes);
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const member = request.nextUrl.searchParams.get("member");
  if (!member) {
    return NextResponse.json(
      { error: "member paraméter szükséges" },
      { status: 400 },
    );
  }
  const votes = await getVotes(member);
  return NextResponse.json({ votes: votes || {} });
}
