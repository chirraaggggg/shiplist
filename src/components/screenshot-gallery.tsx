"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function ScreenshotGallery({ screenshots, productName }: { screenshots: string[]; productName: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! > 0 ? i! - 1 : screenshots.length - 1));
  const next = () => setLightboxIndex((i) => (i! < screenshots.length - 1 ? i! + 1 : 0));

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {screenshots.map((src, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="relative h-44 w-72 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <Image
              src={src}
              alt={`${productName} screenshot ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div
            className="relative max-h-[85vh] max-w-5xl w-full mx-8 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[lightboxIndex]}
              alt={`${productName} screenshot ${lightboxIndex + 1}`}
              width={1200}
              height={675}
              className="object-contain w-full"
            />
          </div>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </>
  );
}
