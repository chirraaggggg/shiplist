"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ShieldCheck } from "lucide-react";
import { Product } from "@/data/mock-products";

interface ProductCardProps {
  product: Product;
  rank?: number;
}

const RANK_STYLES: Record<number, string> = {
  1: "bg-yellow-400 text-yellow-900",
  2: "bg-slate-300 text-slate-700",
  3: "bg-amber-600 text-amber-100",
};

const RANK_LABELS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function ProductCard({ product, rank }: ProductCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(product.upvotes);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpvoted((prev) => {
      const next = !prev;
      setUpvoteCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-px"
    >
      {/* Rank badge */}
      {rank !== undefined && (
        <div
          className={`absolute -left-3 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
            rank <= 3 ? RANK_STYLES[rank] : "bg-muted text-muted-foreground text-xs"
          }`}
        >
          {rank <= 3 ? RANK_LABELS[rank] : `#${rank}`}
        </div>
      )}

      <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">
        {/* Logo */}
        <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-muted shadow-sm">
          <Image
            src={product.logo}
            alt={`${product.name} logo`}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-base truncate text-foreground leading-tight">
              {product.name}
            </h3>
            {product.hasDofollowBadge && (
              <div title="Verified & Dofollow link" className="flex items-center justify-center text-primary flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate mb-2 leading-snug">
            {product.tagline}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Upvote button */}
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={handleUpvote}
          aria-pressed={isUpvoted}
          aria-label={`Upvote ${product.name}`}
          className={`flex flex-col items-center justify-center h-16 w-14 rounded-xl border-2 transition-all duration-200 ${
            isUpvoted
              ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
              : "border-border/50 bg-background text-foreground hover:border-primary/50 hover:text-primary"
          }`}
        >
          <ChevronUp
            className={`h-5 w-5 mb-0.5 transition-transform ${isUpvoted ? "scale-110" : ""}`}
          />
          <span className="text-sm font-bold tabular-nums">
            {upvoteCount >= 1000
              ? `${(upvoteCount / 1000).toFixed(1)}k`
              : upvoteCount}
          </span>
        </button>
      </div>
    </Link>
  );
}
