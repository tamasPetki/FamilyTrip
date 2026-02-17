"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import { FAMILY_MEMBERS, FamilyMember } from "@/lib/types";
import { DestinationCard } from "@/components/DestinationCard";

function VotingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const member = searchParams.get("member");

  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!member || !FAMILY_MEMBERS.includes(member as FamilyMember)) {
      router.push("/");
      return;
    }

    fetch(`/api/votes?member=${encodeURIComponent(member)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.votes && Object.keys(data.votes).length > 0) {
          setVotes(data.votes);
        } else {
          const defaults: Record<string, number> = {};
          destinations.forEach((d) => (defaults[d.id] = 5));
          setVotes(defaults);
        }
        setLoading(false);
      })
      .catch(() => {
        const defaults: Record<string, number> = {};
        destinations.forEach((d) => (defaults[d.id] = 5));
        setVotes(defaults);
        setLoading(false);
      });
  }, [member, router]);

  const handleSubmit = async () => {
    if (!member) return;
    setSubmitting(true);
    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyMember: member, votes }),
      });
      router.push("/eredmenyek");
    } catch {
      alert("Hiba történt a szavazat mentésekor. Próbáld újra!");
      setSubmitting(false);
    }
  };

  if (!member) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">✈️</div>
          <p className="text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          ← Vissza
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {member} szavaz ✈️
        </h1>
        <div className="w-16" />
      </div>

      <p className="text-center text-gray-600 mb-8">
        Húzd a csúszkát 1-10 között minden célállomásnál!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            score={votes[dest.id] ?? 5}
            onScoreChange={(score) =>
              setVotes((prev) => ({ ...prev, [dest.id]: score }))
            }
          />
        ))}
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-4 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] -mx-4 md:mx-0 md:rounded-2xl md:relative md:shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          {submitting ? "Mentés..." : "🗳️ Szavazat leadása"}
        </button>
      </div>
    </main>
  );
}

export default function SzavazasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">✈️</div>
        </div>
      }
    >
      <VotingContent />
    </Suspense>
  );
}
