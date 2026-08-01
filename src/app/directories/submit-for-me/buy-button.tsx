"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function BuyButton({ products, tier }: { products: any[]; tier: string }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dodoProductId = tier === "DIRECTORY_60" 
        ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_DIR_60 || "prod_dir_60_mock"
        : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_DIR_120 || "prod_dir_120_mock";

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: dodoProductId,
          quantity: 1,
          metadata: {
            productId: selectedProductId,
            tier: tier,
          },
        }),
      });

      if (!checkoutRes.ok) {
        throw new Error("Failed to initiate checkout");
      }

      const body = await checkoutRes.text();
      let checkoutUrl: string;
      try {
        const json = JSON.parse(body);
        checkoutUrl = json.url ?? json.checkout_url ?? body;
      } catch {
        checkoutUrl = body;
      }

      if (checkoutUrl.startsWith('http')) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Could not obtain checkout URL");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Select Product</label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        onClick={handleCheckout}
        disabled={isSubmitting || !selectedProductId}
        className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</> : "Buy Now"}
      </button>
    </div>
  );
}
