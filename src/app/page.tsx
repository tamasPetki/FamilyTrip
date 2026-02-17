"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FAMILY_MEMBERS } from "@/lib/types";

const memberEmojis: Record<string, string> = {
  Tomi: "👨",
  Szandra: "👩",
  Polli: "👧",
  Adesz: "👦",
};

const memberColors: Record<string, string> = {
  Tomi: "from-blue-500 to-indigo-600",
  Szandra: "from-pink-500 to-rose-600",
  Polli: "from-purple-500 to-violet-600",
  Adesz: "from-emerald-500 to-teal-600",
};

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (name: string) => {
    router.push(`/szavazas?member=${encodeURIComponent(name)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          ✈️ Családi Nyaralás 2026
        </h1>
        <p className="text-lg text-gray-600">
          Válaszd ki, ki vagy, és szavazz a kedvenc úticélodra!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg">
        {FAMILY_MEMBERS.map((name) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className={`bg-gradient-to-br ${memberColors[name]} text-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer`}
          >
            <span className="text-4xl md:text-5xl block mb-2">
              {memberEmojis[name]}
            </span>
            <span className="text-xl md:text-2xl font-bold">{name}</span>
          </button>
        ))}
      </div>

      <Link
        href="/eredmenyek"
        className="mt-10 text-indigo-600 hover:text-indigo-800 font-medium text-lg underline underline-offset-4 transition-colors"
      >
        📊 Eredmények megtekintése
      </Link>
    </main>
  );
}
