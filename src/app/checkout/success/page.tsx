import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment Successful — ShipList',
  description: 'Your launch has been upgraded. Your premium benefits are now active.',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="text-3xl font-extrabold mb-3">You're live! 🚀</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          Your payment was successful and your premium benefits are now active for this launch.
        </p>

        {/* What happens next */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">What happens next</h2>
          {[
            {
              icon: CheckCircle2,
              color: 'text-emerald-500',
              title: 'Verified badge applied',
              desc: 'Your product now shows a verified badge across the feed and product page.',
            },
            {
              icon: BarChart3,
              color: 'text-blue-500',
              title: 'Analytics are live',
              desc: 'View real-time views and upvote velocity from your product page.',
            },
            {
              icon: Sparkles,
              color: 'text-purple-500',
              title: 'Blog article generating…',
              desc: 'If you chose Premium+, your AI blog article will appear on /blog within a few minutes.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${item.color}`} />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95"
          >
            View the weekly board <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            See the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
