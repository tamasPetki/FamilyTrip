"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { DestinationResult } from "@/lib/types";

interface ResultsData {
  results: DestinationResult[];
  voterCount: number;
  voters: string[];
}

const medalEmojis = ["🥇", "🥈", "🥉"];

export default function EredmenyekPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((d: ResultsData) => {
        setData(d);
        setLoading(false);
        if (d.results.length > 0 && d.voterCount >= 2) {
          setTimeout(fireConfetti, 500);
        }
      })
      .catch(() => setLoading(false));
  }, [fireConfetti]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-gray-600">Eredmények betöltése...</p>
        </div>
      </div>
    );
  }

  if (!data || data.voterCount === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🗳️</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Még nincs szavazat
          </h1>
          <p className="text-gray-600 mb-6">
            Még senki sem szavazott. Legyél te az első!
          </p>
          <Link
            href="/"
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Szavazás indítása
          </Link>
        </div>
      </main>
    );
  }

  const winner = data.results[0];

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          ← Vissza
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          📊 Eredmények
        </h1>
        <div className="w-16" />
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-600">
          Szavaztak:{" "}
          <span className="font-semibold text-gray-900">
            {data.voters.join(", ")}
          </span>{" "}
          ({data.voterCount}/{4})
        </p>
      </div>

      {/* Winner card */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
        <div className="text-center">
          <p className="text-5xl mb-2">🏆</p>
          <p className="text-sm font-medium uppercase tracking-wider opacity-90 mb-1">
            1. hely
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {winner.destination.name}
          </h2>
          <p className="text-2xl font-bold">
            {winner.averageScore} <span className="text-lg opacity-80">pont</span>
          </p>
          <div className="flex justify-center gap-3 mt-3">
            {winner.votes.map((v) => (
              <span
                key={v.familyMember}
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
              >
                {v.familyMember}: {v.score}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rest of the rankings */}
      <div className="space-y-3">
        {data.results.map((r, i) => {
          if (i === 0) return null;
          return (
            <div
              key={r.destination.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-8 text-center">
                    {i < 3 ? medalEmojis[i] : `#${i + 1}`}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900">
                      {r.destination.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {r.destination.costCategory}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-bold text-indigo-600">
                  {r.averageScore}
                </span>
              </div>
              {r.votes.length > 0 && (
                <div className="flex gap-2 mt-2 ml-11">
                  {r.votes.map((v) => (
                    <span
                      key={v.familyMember}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {v.familyMember}: {v.score}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          🗳️ Újra szavazok
        </Link>
      </div>
    </main>
  );
}
