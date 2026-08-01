import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { prisma } from '@/lib/db';
import { ArrowLeft, CalendarDays, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = await prisma.blogPost.findUnique({ where: { slug } });
  } catch {
    return { title: 'Blog — ShipList' };
  }
  if (!post) return { title: 'Post not found — ShipList' };

  return {
    title: `${post.title} — ShipList Blog`,
    description: post.content.replace(/[#*>`\[\]]/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.replace(/[#*>`\[\]]/g, '').substring(0, 160),
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { product: { select: { name: true, slug: true, logo: true, tagline: true, websiteUrl: true } } },
    });
  } catch {
    post = null;
  }

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Generated Article
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            {post.product && (
              <Link
                href={`/product/${post.product.slug}`}
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
              >
                About {post.product.name} ↗
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {/* Product card */}
        {post.product && (
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card mb-10">
            {post.product.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.product.logo}
                alt={post.product.name}
                className="w-12 h-12 rounded-xl object-cover border border-border/50 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-bold">{post.product.name}</p>
              <p className="text-sm text-muted-foreground truncate">{post.product.tagline}</p>
            </div>
            <a
              href={post.product.websiteUrl}
              target="_blank"
              rel="dofollow noopener noreferrer"
              className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Visit Site
            </a>
          </div>
        )}

        <article className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mt-7 mb-3 text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-5 text-foreground/80 leading-relaxed">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="dofollow noopener noreferrer"
                  className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors font-medium"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="mb-5 space-y-2 list-none pl-0">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2 text-foreground/80">
                  <span className="text-primary mt-1 shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic text-muted-foreground my-6">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
