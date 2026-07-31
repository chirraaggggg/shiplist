"use client";

import Image from "next/image";
import { useState } from "react";
import { Code2, Check } from "lucide-react";

interface EmbedBadgeProps {
  logo: string;
  name: string;
  productPageUrl: string;
  embedCode: string;
}

export function EmbedBadgeSection({ logo, name, productPageUrl, embedCode }: EmbedBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Code2 className="h-5 w-5 text-primary" />
        Embed "As Featured On" Badge
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add this badge to your website to link back to your ShipList listing. This gives you a dofollow backlink and showcases your launch.
      </p>

      {/* Badge preview */}
      <a
        href={productPageUrl}
        className="mb-4 inline-flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
        target="_blank"
        rel="noopener"
      >
        <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-border/50">
          <Image src={logo} alt={name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium tracking-wider">AS FEATURED ON</p>
          <p className="text-sm font-bold">ShipList</p>
        </div>
      </a>

      {/* Code block */}
      <div className="rounded-xl bg-muted/50 border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/80">
          <span className="text-xs font-mono text-muted-foreground">HTML Embed</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              "Copy"
            )}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
          {embedCode}
        </pre>
      </div>
    </section>
  );
}
