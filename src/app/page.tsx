import Link from "next/link";
import { ArrowRight, Rocket, Zap } from "lucide-react";
import { MOCK_PRODUCTS, getCurrentISOWeek, getProductsByWeek } from "@/data/mock-products";
import { FeedTabs } from "@/components/feed-tabs";
import { LeaderboardMini } from "@/components/leaderboard-mini";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ShipList — Discover the best new products every week",
  description:
    "ShipList is the modern product launch platform. Discover, upvote, and submit the best new software products each week.",
};

export default function HomePage() {
  const currentWeek = getCurrentISOWeek();
  const weekProducts = getProductsByWeek(currentWeek);
  const allProducts = [...MOCK_PRODUCTS].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>Now featuring AI-powered listings</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discover products
              <br />
              worth shipping.
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              The modern launch platform where makers share their work and builders discover what's new.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3 font-semibold shadow-lg hover:bg-primary/90 transition-all hover:shadow-primary/30 hover:shadow-xl"
              >
                <Rocket className="h-4 w-4" />
                Submit a Product
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border-2 border-border/70 bg-background px-8 py-3 font-semibold hover:bg-muted transition-colors"
              >
                View Leaderboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-8 mt-12 text-muted-foreground">
              {[
                { label: "Products listed", value: "2,400+" },
                { label: "Upvotes cast", value: "89k+" },
                { label: "Makers", value: "1,200+" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-foreground">{value}</p>
                  <p className="text-xs font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main feed */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  This Week's Launches
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {currentWeek} · {weekProducts.length} products
                </p>
              </div>
            </div>

            <FeedTabs weekProducts={weekProducts} allProducts={allProducts} />
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <LeaderboardMini products={allProducts} />

              {/* Submit CTA card */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5">
                <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                <h3 className="font-bold text-base mb-1.5 relative">Have a product to share?</h3>
                <p className="text-sm text-muted-foreground mb-4 relative">
                  Submit your product and reach thousands of makers & early adopters.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors relative"
                >
                  <Rocket className="h-4 w-4" />
                  Submit now
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
