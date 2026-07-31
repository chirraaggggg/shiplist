import Link from "next/link";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { Product } from "@/data/mock-products";

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardMini({ products }: { products: Product[] }) {
  const top5 = products.slice(0, 5);
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Weekly Leaderboard</h3>
        <Link
          href="/leaderboard"
          className="text-xs text-primary font-medium hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <ol className="space-y-3">
        {top5.map((product, i) => (
          <li key={product.id}>
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-3 group rounded-lg p-1.5 -mx-1.5 hover:bg-muted/50 transition-colors"
            >
              <span className="w-6 text-center text-sm font-bold flex-shrink-0 tabular-nums">
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </span>
              <div className="relative h-8 w-8 flex-shrink-0 rounded-lg overflow-hidden border border-border/50">
                <Image src={product.logo} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {product.name}
                </p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                <ChevronUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold tabular-nums">
                  {product.upvotes >= 1000
                    ? `${(product.upvotes / 1000).toFixed(1)}k`
                    : product.upvotes}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
