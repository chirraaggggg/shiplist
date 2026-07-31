import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentISOWeek } from "@/data/mock-products";

/**
 * Scheduled Cron Job Handler: Weekly Leaderboard Finalization
 * Runs at the end of each ISO week (Sunday 23:59 UTC).
 * Locks in final ranks and marks top 3 products with a "winner" badge.
 */
export async function GET(request: NextRequest) {
  // 1. Authorization check via CRON_SECRET header (Vercel Cron standard)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const currentWeek = getCurrentISOWeek();

    // 2. Fetch all products submitted for the current week, ordered by upvote count
    const products = await db.product.findMany({
      where: {
        launchWeek: currentWeek,
        status: { not: "FLAGGED" },
      },
      orderBy: {
        upvoteCount: "desc",
      },
    });

    if (products.length === 0) {
      return NextResponse.json({
        message: `No active products found for week ${currentWeek}`,
        finalizedCount: 0,
      });
    }

    // 3. Atomically update ranks and assign winner badges to top 3 products
    const updates = products.map((product, index) => {
      const rank = index + 1;
      const isWeeklyWinner = rank <= 3;

      return db.product.update({
        where: { id: product.id },
        data: {
          weeklyRank: rank,
          isWeeklyWinner: isWeeklyWinner,
        },
      });
    });

    await db.$transaction(updates);

    console.log(
      `[Cron Finalize Week] Finalized week ${currentWeek} for ${products.length} products. Top 3 marked as winners.`
    );

    return NextResponse.json({
      success: true,
      week: currentWeek,
      finalizedCount: products.length,
      winners: products.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        id: p.id,
        name: p.name,
        upvotes: p.upvoteCount,
      })),
    });
  } catch (error: any) {
    console.error("[Cron Finalize Week Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to finalize weekly leaderboard" },
      { status: 500 }
    );
  }
}
