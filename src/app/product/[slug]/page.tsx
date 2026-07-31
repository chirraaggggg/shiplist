import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Tag, User } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

import { getProductBySlug, MOCK_PRODUCTS } from "@/data/mock-products";
import { UpvoteButton } from "@/components/upvote-button";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { CommentsSection } from "@/components/comments-section";
import { EmbedBadgeSection } from "@/components/embed-badge-section";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.tagline} | ShipList`,
    description: product.description.replace(/[#*>`\[\]]/g, "").substring(0, 160),
    openGraph: {
      title: `${product.name} — ${product.tagline}`,
      description: product.description.replace(/[#*>`\[\]]/g, "").substring(0, 160),
      images: product.screenshots[0]
        ? [{ url: product.screenshots[0], width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} on ShipList`,
      description: product.tagline,
      images: product.screenshots[0] ? [product.screenshots[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productPageUrl = `https://shiplist.com/product/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    url: product.websiteUrl,
    image: product.screenshots[0],
    brand: {
      "@type": "Organization",
      name: product.maker.name,
    },
    offers: {
      "@type": "Offer",
      price: product.pricingType === "free" || product.pricingType === "open_source" ? "0" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
  };

  const embedCode = `<a href="${productPageUrl}" rel="dofollow" target="_blank">
  <img src="${productPageUrl}/badge.svg" alt="As Featured on ShipList" width="200" />
</a>`;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Product Header */}
        <div className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 md:px-6 py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Logo */}
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-border/50 shadow-lg flex-shrink-0">
                <Image
                  src={product.logo}
                  alt={`${product.name} logo`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Name & meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {product.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    {product.pricingType.replace("_", " ")}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground mb-3">{product.tagline}</p>

                {/* Maker */}
                <Link
                  href={product.maker.profileUrl}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="relative h-6 w-6 rounded-full overflow-hidden border border-border/50">
                    <Image
                      src={product.maker.avatar}
                      alt={product.maker.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium">{product.maker.name}</span>
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <UpvoteButton
                  initialCount={product.upvotes}
                  productName={product.name}
                  large
                />
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel="dofollow noopener"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border/60 bg-background font-bold text-base hover:bg-muted hover:border-border/80 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl space-y-12">
          {/* Screenshots */}
          {product.screenshots.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Screenshots</h2>
              <ScreenshotGallery
                screenshots={product.screenshots}
                productName={product.name}
              />
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mt-6 mb-2 text-foreground">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-foreground/80 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-1.5 list-none pl-0">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-foreground/80">
                      <span className="text-primary mt-1">•</span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {product.description}
              </ReactMarkdown>
            </div>
          </section>

          {/* Tags & Categories */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tags & Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {c}
                </span>
              ))}
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </section>

          {/* Embed Badge */}
          <EmbedBadgeSection
            logo={product.logo}
            name={product.name}
            productPageUrl={productPageUrl}
            embedCode={embedCode}
          />

          {/* Comments */}
          <CommentsSection comments={product.comments} productName={product.name} />
        </div>
      </div>
    </>
  );
}
