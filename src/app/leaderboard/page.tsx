import Link from "next/link";
import Image from "next/image";
import { ChevronUp, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { MOCK_PRODUCTS, getProductsByWeek, getCurrentISOWeek } from "@/data/mock-products";
import { getISOWeek, getYear, addWeeks, startOfWeek, format } from "date-fns";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Weekly Leaderboard — ShipList",
  description:
    "Browse the weekly leaderboard of the most upvoted products on ShipList.",
};

// Generate list of recent weeks
function getWeekOptions(count = 8): { id: string; label: string }[] {
  const now = new Date();
  const weeks = [];
  for (let i = 0; i < count; i++) {
    const d = addWeeks(startOfWeek(now, { weekStartsOn: 1 }), -i);
    const week = getISOWeek(d);
    const year = getYear(d);
    weeks.push({
      id: `${year}-W${String(week).padStart(2, "0")}`,
      label: `Week ${week} — ${format(d, "MMM d, yyyy")}`,
    });
  }
  return weeks;
}

const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function LeaderboardPage({ searchParams }: Props) {
  const { week: weekParam } = await searchParams;
  const currentWeek = getCurrentISOWeek();
  const selectedWeek = weekParam || currentWeek;

  const weekOptions = getWeekOptions();
  // For mock data: show all products sorted by upvotes for the current week,
  // and a filtered subset for past weeks to simulate different data
  const products =
    selectedWeek === currentWeek
      ? [...MOCK_PRODUCTS].sort((a, b) => b.upvotes - a.upvotes)
      : getProductsByWeek(selectedWeek).length > 0
      ? getProductsByWeek(selectedWeek)
      : [];

  const currentWeekIndex = weekOptions.findIndex((w) => w.id === selectedWeek);
  const prevWeek = weekOptions[currentWeekIndex + 1]?.id;
  const nextWeek = weekOptions[currentWeekIndex - 1]?.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-background py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Weekly Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">
            The most upvoted products from the ShipList community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8">
        {/* Week Picker */}
        <div className="flex items-center justify-between mb-8 bg-card border border-border/50 rounded-2xl p-3 shadow-sm">
          <Link
            href={prevWeek ? `/leaderboard?week=${prevWeek}` : "#"}
            aria-disabled={!prevWeek}
            className={`p-2 rounded-xl transition-colors ${
              prevWeek ? "hover:bg-muted text-foreground" : "text-muted-foreground/30 pointer-events-none"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {weekOptions.slice(0, 5).map((w) => (
              <Link
                key={w.id}
                href={`/leaderboard?week=${w.id}`}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedWeek === w.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {w.id === currentWeek ? "This Week" : w.id}
              </Link>
            ))}
          </div>

          <Link
            href={nextWeek ? `/leaderboard?week=${nextWeek}` : "#"}
            aria-disabled={!nextWeek}
            className={`p-2 rounded-xl transition-colors ${
              nextWeek ? "hover:bg-muted text-foreground" : "text-muted-foreground/30 pointer-events-none"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Leaderboard list */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold mb-2">No launches yet for {selectedWeek}</p>
            <p className="text-sm">
              <Link href="/submit" className="text-primary hover:underline font-medium">
                Submit your product
              </Link>{" "}
              to be listed here.
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {products.map((product, i) => {
              const rank = i + 1;
              return (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-xl hover:shadow-md hover:border-border/80 hover:-translate-y-px transition-all duration-200 group"
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {rank <= 3 ? (
                        <span className="text-2xl">{MEDALS[rank - 1]}</span>
                      ) : (
                        <span className="text-lg font-black text-muted-foreground">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Logo */}
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                      <Image
                        src={product.logo}
                        alt={`${product.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{product.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {product.categories.map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Upvotes */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                      <ChevronUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-black tabular-nums text-foreground">
                        {product.upvotes >= 1000
                          ? `${(product.upvotes / 1000).toFixed(1)}k`
                          : product.upvotes}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
