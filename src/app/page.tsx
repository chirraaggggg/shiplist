import { ProductCard } from "@/components/product-card";
import { MOCK_PRODUCTS } from "@/data/mock-products";

export default function Home() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Launch your next big thing
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-[600px]">
          ShipList is the modern platform to discover, launch, and grow the best new products.
        </p>
        <div className="flex gap-4">
          <a href="/submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-sm">
            Submit Product
          </a>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Today's Leaderboard</h2>
          <span className="text-sm text-muted-foreground font-medium">Updated just now</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
