"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { scrapeAndAnalyzeUrl } from "@/app/submit/actions";
import { ProductFormData } from "./types";

interface Step1Props {
  onNext: (data: Partial<ProductFormData>) => void;
  initialUrl: string;
}

const LOADING_MESSAGES = [
  "Scanning your site...",
  "Extracting key details...",
  "Drafting your listing...",
  "Almost there...",
];

export function Step1Url({ onNext, initialUrl }: Step1Props) {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let validUrl = url.trim();
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
      setUrl(validUrl);
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await scrapeAndAnalyzeUrl(validUrl);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to analyze URL");
      }

      onNext({
        url: validUrl,
        name: result.data.name || "",
        tagline: result.data.tagline || "",
        description: result.data.description || "",
        category: result.data.suggestedCategory || "",
        tags: result.data.suggestedTags || [],
        pricingType: result.data.pricingType || "",
        favicon: result.data.favicon,
        ogImage: result.data.ogImage,
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      // Fallback: let them proceed manually
      onNext({ url: validUrl });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Paste your URL</h1>
        <p className="text-muted-foreground text-lg">
          We'll automatically extract the best details to build your listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourproduct.com"
          disabled={isLoading}
          className="w-full h-16 pl-14 pr-36 rounded-2xl border-2 border-border/50 bg-card text-xl shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          required
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-full px-6 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Analyze
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-3 w-full animate-in fade-in">
          <p className="flex-1">
            <strong>Error:</strong> {error}
            <br />
            Don't worry, you can still fill out the details manually on the next step.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in">
          <div className="flex space-x-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-primary font-medium animate-pulse">
            {LOADING_MESSAGES[loadingMessageIdx]}
          </p>
        </div>
      )}
    </div>
  );
}
