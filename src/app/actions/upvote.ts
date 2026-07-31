"use server";

import { getSessionUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Anti-gaming configuration constants
const ANTI_GAMING_NEW_ACCOUNT_HOURS = 24; // Accounts created in last 24 hours
const ANTI_GAMING_WINDOW_MINUTES = 10;   // Window M = 10 minutes
const ANTI_GAMING_THRESHOLD = 10;        // Threshold N = 10 upvotes

/**
 * Heuristic check for upvote fraud / anti-gaming.
 * Flags product if > N upvotes in last M minutes come from accounts < 24h old.
 */
async function runAntiGamingCheck(productId: string) {
  try {
    const windowStart = new Date(Date.now() - ANTI_GAMING_WINDOW_MINUTES * 60 * 1000);
    const newAccountCutoff = new Date(Date.now() - ANTI_GAMING_NEW_ACCOUNT_HOURS * 3600 * 1000);

    // Count recent upvotes on this product from newly created accounts
    const suspectUpvoteCount = await db.upvote.count({
      where: {
        productId,
        createdAt: { gte: windowStart },
        user: {
          createdAt: { gte: newAccountCutoff },
        },
      },
    });

    if (suspectUpvoteCount >= ANTI_GAMING_THRESHOLD) {
      const trustPenalty = Math.max(0.1, 1.0 - (suspectUpvoteCount - ANTI_GAMING_THRESHOLD + 1) * 0.1);
      
      await db.product.update({
        where: { id: productId },
        data: {
          flagged: true,
          status: "FLAGGED",
          trustScore: trustPenalty,
        },
      });
      console.warn(`[Anti-Gaming] Product ${productId} flagged due to ${suspectUpvoteCount} suspicious upvotes.`);
    }
  } catch (err) {
    console.error("[Anti-Gaming] Heuristic check failed:", err);
  }
}

export type UpvoteResponse = {
  success: boolean;
  upvoted?: boolean;
  newCount?: number;
  error?: string;
};

export async function toggleUpvote(productId: string): Promise<UpvoteResponse> {
  // 1. Authentication check
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be signed in to upvote." };
  }

  // 2. Rate limiting check (1 action per second per user)
  const isAllowed = await checkRateLimit(user.id, "upvote");
  if (!isAllowed) {
    return { success: false, error: "Too many requests. Please wait a moment." };
  }

  try {
    // Ensure User record exists in Database
    await db.user.upsert({
      where: { clerkId: user.clerkId },
      update: { email: user.email, name: user.name },
      create: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    // Check if user already upvoted
    const existingUpvote = await db.upvote.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    let upvoted = false;
    let newCount = 0;

    if (existingUpvote) {
      // Toggle OFF: Remove upvote and decrement count atomically in transaction
      const [, updatedProduct] = await db.$transaction([
        db.upvote.delete({
          where: { id: existingUpvote.id },
        }),
        db.product.update({
          where: { id: productId },
          data: {
            upvoteCount: { decrement: 1 },
          },
        }),
      ]);
      upvoted = false;
      newCount = updatedProduct.upvoteCount;
    } else {
      // Toggle ON: Create upvote and increment count atomically in transaction
      const [, updatedProduct] = await db.$transaction([
        db.upvote.create({
          data: {
            userId: user.id,
            productId: productId,
          },
        }),
        db.product.update({
          where: { id: productId },
          data: {
            upvoteCount: { increment: 1 },
          },
        }),
      ]);
      upvoted = true;
      newCount = updatedProduct.upvoteCount;

      // Asynchronously trigger anti-gaming heuristic check
      void runAntiGamingCheck(productId);
    }

    revalidatePath("/");
    revalidatePath(`/product/${productId}`);
    revalidatePath("/leaderboard");

    return {
      success: true,
      upvoted,
      newCount,
    };
  } catch (error: any) {
    console.error("Upvote error:", error);
    return {
      success: false,
      error: error.message || "Failed to process upvote.",
    };
  }
}
