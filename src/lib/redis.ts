import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function saveVotes(
  familyMember: string,
  votes: Record<string, number>,
) {
  const key = `votes:${familyMember}`;
  await redis.hset(key, votes);
}

export async function getVotes(
  familyMember: string,
): Promise<Record<string, number> | null> {
  const key = `votes:${familyMember}`;
  const data = await redis.hgetall<Record<string, string>>(key);
  if (!data || Object.keys(data).length === 0) return null;
  const votes: Record<string, number> = {};
  for (const [k, v] of Object.entries(data)) {
    votes[k] = Number(v);
  }
  return votes;
}

export async function getAllVotes(): Promise<
  Record<string, Record<string, number>>
> {
  const members = ["Tomi", "Szandra", "Polli", "Adesz"];
  const result: Record<string, Record<string, number>> = {};
  for (const member of members) {
    const votes = await getVotes(member);
    if (votes) {
      result[member] = votes;
    }
  }
  return result;
}
