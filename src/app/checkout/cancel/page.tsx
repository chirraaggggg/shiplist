import Link from 'next/link';
import type { Metadata } from 'next';
import { XCircle, ArrowRight, Zap, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Checkout Canceled — ShipList',
  description: 'Your payment was not completed. You can upgrade your launch at any time.',
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-orange-500/5">
          <XCircle className="h-10 w-10" />
        </div>

        <h1 className="text-3xl font-extrabold mb-3">Checkout canceled</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          No worries — your product is still queued as a Free launch. You can upgrade whenever you're ready.
        </p>

        {/* What you're missing */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
            What you're missing out on
          </h2>
          {[
            {
              icon: Zap,
              color: 'text-blue-500',
              label: 'Premium — $99',
              desc: 'Verified badge · Priority feed placement · Advanced analytics',
            },
            {
              icon: Rocket,
              color: 'text-purple-500',
              label: 'Premium+ — $299',
              desc: 'Everything in Premium + AI-written blog article with dofollow backlinks',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${item.color}`} />
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all active:scale-95"
          >
            Review pricing <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
