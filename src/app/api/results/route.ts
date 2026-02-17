import { NextResponse } from "next/server";
import { getAllVotes } from "@/lib/redis";
import { destinations } from "@/lib/destinations";

export async function GET() {
  const allVotes = await getAllVotes();

  const results = destinations
    .map((dest) => {
      const votesForDest: { familyMember: string; score: number }[] = [];
      for (const [member, votes] of Object.entries(allVotes)) {
        if (votes[dest.id] !== undefined) {
          votesForDest.push({ familyMember: member, score: votes[dest.id] });
        }
      }
      const avg =
        votesForDest.length > 0
          ? votesForDest.reduce((sum, v) => sum + v.score, 0) /
            votesForDest.length
          : 0;

      return {
        destination: dest,
        averageScore: Math.round(avg * 10) / 10,
        votes: votesForDest,
        totalVotes: votesForDest.length,
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore);

  return NextResponse.json({
    results,
    voterCount: Object.keys(allVotes).length,
    voters: Object.keys(allVotes),
  });
}
