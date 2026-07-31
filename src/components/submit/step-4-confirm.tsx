"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Rocket } from "lucide-react";
import { submitProduct } from "@/app/submit/actions";
import { ProductFormData } from "./types";
import Image from "next/image";

interface Step4Props {
  data: ProductFormData;
  onBack: () => void;
}

export function Step4Confirm({ data, onBack }: Step4Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitProduct(data);
      if (result.success) {
        // Use router to redirect to success page, passing some data via query params or state.
        // For simplicity, we just pass the week and productId in query params
        const params = new URLSearchParams({
          week: data.launchWeek,
          id: result.productId,
          name: data.name
        });
        router.push(`/submit/success?${params.toString()}`);
      } else {
        throw new Error(result.error || "Failed to submit product");
      }
    } catch (err: any) {
      console.error("Submit error", err);
      setError(err.message || "Something went wrong during submission.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Ready for liftoff 🚀</h2>
        <p className="text-muted-foreground">
          Review your listing details before we schedule it for launch.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl border border-border/50 bg-background overflow-hidden relative flex-shrink-0">
              {data.favicon ? (
                <Image src={data.favicon} alt="Logo" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                  Logo
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{data.name}</h3>
              <p className="text-muted-foreground mt-1">{data.tagline}</p>
              <div className="flex gap-2 mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                  {data.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {data.pricingType}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm leading-relaxed">{data.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/50 bg-background">
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Launch Week</h4>
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {data.launchWeek}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-background">
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Pricing Tier</h4>
              <div className="font-bold flex items-center gap-2 capitalize text-primary">
                <Rocket className="h-4 w-4" />
                {data.tier.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="flex items-start gap-3 cursor-pointer group mb-8 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
          <div className="flex items-center h-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 rounded border-border/50 text-primary focus:ring-primary transition-colors cursor-pointer"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            I confirm that I am authorized to submit this product and I agree to the{" "}
            <a href="#" className="font-medium text-foreground underline decoration-primary/50 hover:decoration-primary transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="font-medium text-foreground underline decoration-primary/50 hover:decoration-primary transition-colors">Community Guidelines</a>.
          </div>
        </label>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl border border-border/50 font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!agreed || isSubmitting}
            className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm & Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
