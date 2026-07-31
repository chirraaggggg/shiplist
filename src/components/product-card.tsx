import Image from "next/image";
import { ChevronUp, ShieldCheck } from "lucide-react";
import { Product } from "@/data/mock-products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl transition-all duration-200 hover:shadow-md hover:border-border/80">
      <div className="flex items-center gap-5 overflow-hidden">
        <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted">
          <Image
            src={product.logo}
            alt={`${product.name} logo`}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate text-foreground">{product.name}</h3>
            {product.hasDofollowBadge && (
              <div title="Verified & Dofollow link" className="flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate mb-1.5">{product.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {product.categories.map(category => (
              <span key={category} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="ml-4 flex-shrink-0">
        <button className="flex flex-col items-center justify-center h-16 w-14 rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors">
          <ChevronUp className="h-5 w-5 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
          <span className="text-sm font-semibold">{product.upvotes}</span>
        </button>
      </div>
    </div>
  );
}
