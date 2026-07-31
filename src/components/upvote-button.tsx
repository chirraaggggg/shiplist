"use client";

import { useState, useTransition } from "react";
import { ChevronUp } from "lucide-react";
import { toggleUpvote } from "@/app/actions/upvote";

interface UpvoteButtonProps {
  productId: string;
  initialCount: number;
  productName: string;
  initialUpvoted?: boolean;
  large?: boolean;
}

export function UpvoteButton({
  productId,
  initialCount,
  productName,
  initialUpvoted = false,
  large = false,
}: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    const nextUpvoted = !isUpvoted;
    setIsUpvoted(nextUpvoted);
    setCount((c) => (nextUpvoted ? c + 1 : c - 1));

    startTransition(async () => {
      const res = await toggleUpvote(productId);
      if (!res.success) {
        // Revert on error / rate limit
        setIsUpvoted(!nextUpvoted);
        setCount((c) => (nextUpvoted ? c - 1 : c + 1));
        if (res.error) {
          console.warn("Upvote action note:", res.error);
        }
      } else if (res.newCount !== undefined) {
        setCount(res.newCount);
        setIsUpvoted(!!res.upvoted);
      }
    });
  };

  if (large) {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={isUpvoted}
        aria-label={`Upvote ${productName}`}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-200 ${
          isUpvoted
            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
            : "border-border/60 bg-background hover:border-primary/50 hover:text-primary"
        } ${isPending ? "opacity-90 cursor-wait" : ""}`}
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
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={isUpvoted}
      aria-label={`Upvote ${productName}`}
      className={`flex flex-col items-center justify-center h-16 w-14 rounded-xl border-2 transition-all duration-200 ${
        isUpvoted
          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
          : "border-border/50 bg-background text-foreground hover:border-primary/50 hover:text-primary"
      } ${isPending ? "opacity-90 cursor-wait" : ""}`}
    >
      <ChevronUp className={`h-5 w-5 mb-0.5 transition-transform ${isUpvoted ? "scale-110" : ""}`} />
      <span className="text-sm font-bold tabular-nums">
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </span>
    </button>
  );
}
