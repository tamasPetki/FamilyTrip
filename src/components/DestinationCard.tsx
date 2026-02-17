"use client";

import { useState, useRef, useCallback } from "react";
import { Destination } from "@/lib/types";

interface Props {
  destination: Destination;
  score: number;
  onScoreChange: (score: number) => void;
}

export function DestinationCard({ destination, score, onScoreChange }: Props) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (Math.abs(diff) < minSwipeDistance) return;
    if (diff > 0) {
      // swipe left -> next
      setCurrentImageIndex((prev) =>
        prev === destination.imageUrls.length - 1 ? 0 : prev + 1
      );
    } else {
      // swipe right -> prev
      setCurrentImageIndex((prev) =>
        prev === 0 ? destination.imageUrls.length - 1 : prev - 1
      );
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [destination.imageUrls.length]);

  const scoreColor =
    score <= 3
      ? "text-red-500"
      : score <= 5
        ? "text-amber-500"
        : score <= 7
          ? "text-blue-500"
          : "text-emerald-500";

  const mainImage = destination.imageUrls[currentImageIndex];
  const mainAlt = destination.imageAlts[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === destination.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? destination.imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      {/* Kép carousel */}
      <div
        className="relative h-64 w-full group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!imgError && mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={mainAlt}
            className="w-full h-64 object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-64 bg-gradient-to-br ${destination.fallbackGradient} flex items-center justify-center text-6xl`}
          >
            {destination.fallbackEmoji}
          </div>
        )}

        {/* Navigációs nyilak */}
        {destination.imageUrls.length > 1 && !imgError && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              aria-label="Előző kép"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              aria-label="Következő kép"
            >
              ›
            </button>

            {/* Dots indikátor */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {destination.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Kép ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
          {destination.costCategory}
        </span>
        <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
          ✈️ {destination.travelTime}
        </span>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {destination.name}
        </h3>
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          {destination.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {destination.highlights.map((h, i) => (
            <span
              key={i}
              className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Részletek gomb */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          {expanded ? "Kevesebb" : "Részletek, programok, összehasonlítás"}
          <span
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {/* Kinyíló részletes szekció */}
        {expanded && (
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
            {/* Miért jó? */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                ✅ Miért éri meg?
              </h4>
              <ul className="space-y-1">
                {destination.pros.map((pro, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kinek ajánljuk? */}
            <div className="bg-indigo-50 rounded-xl p-3">
              <h4 className="text-sm font-bold text-indigo-900 mb-1">
                🎯 Kinek ajánljuk?
              </h4>
              <p className="text-sm text-indigo-800">{destination.bestFor}</p>
            </div>

            {/* Programok */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                🗓️ Programok
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {destination.programs.map((prog, i) => (
                  <span key={i} className="text-sm text-gray-700">
                    {prog}
                  </span>
                ))}
              </div>
            </div>

            {/* Összehasonlítás */}
            <div className="bg-amber-50 rounded-xl p-3">
              <h4 className="text-sm font-bold text-amber-900 mb-1">
                ⚖️ Összehasonlítás
              </h4>
              <p className="text-sm text-amber-800">
                {destination.comparison}
              </p>
            </div>
          </div>
        )}

        {/* Pontszám slider */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-3">
          <span
            className={`text-3xl font-bold w-10 text-center ${scoreColor}`}
          >
            {score}
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => onScoreChange(Number(e.target.value))}
            className="flex-1 h-2 rounded-lg cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-6">/ 10</span>
        </div>
      </div>
    </div>
  );
}
