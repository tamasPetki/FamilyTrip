export interface Destination {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  pros: string[];
  bestFor: string;
  programs: string[];
  comparison: string;
  travelTime: string;
  costCategory: string;
  imageUrls: string[];
  imageAlts: string[];
  fallbackGradient: string;
  fallbackEmoji: string;
}

export interface VoteSubmission {
  familyMember: FamilyMember;
  votes: Record<string, number>;
}

export interface DestinationResult {
  destination: Destination;
  averageScore: number;
  votes: { familyMember: string; score: number }[];
  totalVotes: number;
}

export const FAMILY_MEMBERS = ["Tomi", "Szandra", "Polli", "Adesz"] as const;
export type FamilyMember = (typeof FAMILY_MEMBERS)[number];
