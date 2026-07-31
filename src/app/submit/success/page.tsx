"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Rocket, ArrowRight } from "lucide-react";
import { useState, Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const week = searchParams.get("week");
  const name = searchParams.get("name") || "Your product";
  const productId = searchParams.get("id");
  
  const [copied, setCopied] = useState(false);
  
  const previewUrl = `https://shiplist.com/preview/${productId || "demo"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-700 mt-20">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <div className="absolute -top-2 -right-2 bg-background rounded-full p-1">
          <Rocket className="h-8 w-8 text-yellow-500 animate-bounce" />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4">Submission Successful!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        {name} has been received and scheduled for launch in <strong className="text-foreground">{week || "an upcoming week"}</strong>.
      </p>

      <div className="w-full bg-card border border-border/50 p-6 rounded-2xl shadow-sm mb-8 relative">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-left">Shareable Preview Link</h3>
        <div className="flex items-center gap-3">
          <code className="flex-1 p-3 rounded-xl bg-muted text-sm text-left truncate border border-border/50">
            {previewUrl}
          </code>
          <button 
            onClick={handleCopy}
            className="h-[46px] px-6 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="px-8 py-3 rounded-xl font-semibold border-2 border-border/50 hover:bg-muted transition-colors"
        >
          Return Home
        </Link>
        <Link 
          href={`/preview/${productId || "demo"}`} 
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          View Preview
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="animate-pulse flex items-center justify-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
