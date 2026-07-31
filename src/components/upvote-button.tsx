"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

interface UpvoteButtonProps {
  initialCount: number;
  productName: string;
  large?: boolean;
}

export function UpvoteButton({ initialCount, productName, large = false }: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggle = () => {
    setIsUpvoted((prev) => {
      const next = !prev;
      setCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  if (large) {
    return (
      <button
        onClick={toggle}
        aria-pressed={isUpvoted}
        aria-label={`Upvote ${productName}`}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-200 ${
          isUpvoted
            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
            : "border-border/60 bg-background hover:border-primary/50 hover:text-primary"
        }`}
      >
        <ChevronUp className={`h-6 w-6 transition-transform ${isUpvoted ? "scale-110" : ""}`} />
        <span className="tabular-nums">
          {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={isUpvoted}
      aria-label={`Upvote ${productName}`}
      className={`flex flex-col items-center justify-center h-16 w-14 rounded-xl border-2 transition-all duration-200 ${
        isUpvoted
          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
          : "border-border/50 bg-background hover:border-primary/50 hover:text-primary"
      }`}
    >
      <ChevronUp className="h-5 w-5 mb-0.5" />
      <span className="text-sm font-bold tabular-nums">
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </span>
    </button>
  );
}
