"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/data/mock-products";

const CATEGORIES = ["Developer Tools", "Productivity", "SaaS", "AI", "Fintech", "Design Tools"];

type Tab = "week" | "all" | "category";

interface FeedTabsProps {
  weekProducts: Product[];
  allProducts: Product[];
}

export function FeedTabs({ weekProducts, allProducts }: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("week");
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);

  const displayProducts =
    activeTab === "week"
      ? weekProducts
      : activeTab === "all"
      ? allProducts
      : allProducts.filter((p) => p.categories.includes(activeCategory));

  const tabs: { id: Tab; label: string }[] = [
    { id: "week", label: "This Week" },
    { id: "all", label: "All Time" },
    { id: "category", label: "By Category" },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {activeTab === "category" && (
        <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in duration-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Product list */}
      <div className="flex flex-col gap-3 animate-in fade-in duration-300">
        {displayProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">🚀</p>
            <p className="font-medium">No products found.</p>
            <p className="text-sm mt-1">Be the first to submit one!</p>
          </div>
        ) : (
          displayProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={activeTab === "week" ? i + 1 : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
