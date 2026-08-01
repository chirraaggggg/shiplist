import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CheckCircle2, XCircle, Calendar, Zap, Rocket,
  BarChart3, BadgeCheck, BookOpen, Link2, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — ShipList',
  description: 'Transparent, one-time pricing to give your product launch the visibility it deserves. Free, Premium, or Premium+ — no subscriptions, ever.',
};

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    tagline: 'Launch on the weekly board',
    description: 'Everything you need to get your product discovered by the community.',
    icon: Calendar,
    cta: 'Submit for Free',
    href: '/submit',
    gradient: 'from-slate-500/10 to-slate-600/5',
    border: 'border-border/60',
    iconBg: 'bg-slate-500/10 text-slate-400',
    badge: null,
    features: [
      { text: 'Listed on the weekly board', included: true },
      { text: 'Community comments & upvotes', included: true },
      { text: 'SEO-optimised product page', included: true },
      { text: 'Verified badge', included: false },
      { text: 'Priority feed placement', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'AI-generated blog article', included: false },
      { text: 'Contextual dofollow backlinks', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99',
    tagline: 'Dominate your launch week',
    description: 'Stand out with priority placement, a verified badge, and powerful analytics.',
    icon: Zap,
    cta: 'Upgrade to Premium',
    href: '/submit',
    gradient: 'from-blue-600/15 to-indigo-600/10',
    border: 'border-blue-500/40',
    iconBg: 'bg-blue-500/15 text-blue-400',
    badge: 'Most Popular',
    badgeBg: 'bg-blue-500',
    features: [
      { text: 'Listed on the weekly board', included: true },
      { text: 'Community comments & upvotes', included: true },
      { text: 'SEO-optimised product page', included: true },
      { text: 'Verified badge', included: true },
      { text: 'Priority feed placement', included: true },
      { text: 'Advanced analytics (views, upvote velocity)', included: true },
      { text: 'AI-generated blog article', included: false },
      { text: 'Contextual dofollow backlinks', included: false },
    ],
  },
  {
    id: 'premium_plus',
    name: 'Premium+',
    price: '$299',
    tagline: 'The full launch experience',
    description: 'Everything in Premium, plus an AI-written SEO article published to our blog with dofollow backlinks to your site.',
    icon: Rocket,
    cta: 'Go Premium+',
    href: '/submit',
    gradient: 'from-purple-600/15 to-pink-600/10',
    border: 'border-purple-500/40',
    iconBg: 'bg-purple-500/15 text-purple-400',
    badge: 'Best Value',
    badgeBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    features: [
      { text: 'Listed on the weekly board', included: true },
      { text: 'Community comments & upvotes', included: true },
      { text: 'SEO-optimised product page', included: true },
      { text: 'Verified badge', included: true },
      { text: 'Priority feed placement', included: true },
      { text: 'Advanced analytics (views, upvote velocity)', included: true },
      { text: '~1500-word AI blog article on /blog', included: true },
      { text: '3–4 contextual dofollow backlinks', included: true },
    ],
  },
];

const FAQ = [
  {
    q: 'Is this a one-time payment or a subscription?',
    a: 'Completely one-time. You pay once per product launch — no recurring charges, ever.',
  },
  {
    q: 'How does the AI blog article work?',
    a: 'After your Premium+ payment is confirmed, our system automatically generates a ~1500-word SEO article about your product using Claude AI, then publishes it to /blog. The article includes 3–4 natural dofollow links back to your site to boost your domain authority.',
  },
  {
    q: 'Who handles taxes and VAT?',
    a: 'Dodo Payments acts as the Merchant of Record, so global sales tax, VAT, and GST compliance is handled automatically — no matter where your customers are.',
  },
  {
    q: 'Can I upgrade after submitting as Free?',
    a: 'Yes. You can hit the Upgrade button on your product page at any time to pay and unlock Premium or Premium+ benefits for that launch.',
  },
  {
    q: 'What is "priority feed placement"?',
    a: 'Premium and Premium+ products are ranked above free listings during their launch week, giving you more visibility when it matters most.',
  },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-32 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="py-20 md:py-28 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
          <Star className="h-3.5 w-3.5 fill-current" />
          One-time payments. No subscriptions.
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto mb-6 leading-[1.1]">
          Give your launch the spotlight it deserves
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Three simple tiers. Pay once per launch. Global tax compliance handled automatically by Dodo Payments.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const isPremiumPlus = tier.id === 'premium_plus';
            const isPremium = tier.id === 'premium';
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-3xl border-2 bg-card overflow-hidden transition-all hover:shadow-xl ${tier.border} ${isPremium ? 'shadow-lg shadow-blue-500/10 md:-mt-3 md:mb-3' : ''} ${isPremiumPlus ? 'shadow-lg shadow-purple-500/10' : ''}`}
              >
                {/* Gradient header strip */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isPremium ? 'from-blue-400 to-indigo-500' : isPremiumPlus ? 'from-purple-400 to-pink-500' : 'from-slate-400 to-slate-500'}`} />

                {tier.badge && (
                  <div className="absolute top-5 right-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider ${tier.badgeBg}`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className={`p-8 pb-6 bg-gradient-to-br ${tier.gradient}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${tier.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-1">{tier.name}</h2>
                  <p className="text-sm text-muted-foreground mb-5">{tier.tagline}</p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                    {tier.price !== '$0' && (
                      <span className="text-muted-foreground pb-1.5 font-medium">one-time</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-8 pt-6">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{tier.description}</p>

                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {f.included ? (
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm font-medium ${f.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`w-full py-3.5 rounded-2xl text-center font-bold text-base transition-all active:scale-95 ${
                      isPremiumPlus
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/20'
                        : isPremium
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust banner */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Powered by Dodo Payments
          </span>
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Global tax compliance (VAT/GST)
          </span>
          <span className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            No subscriptions
          </span>
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Claude AI-powered blog articles
          </span>
        </div>
      </section>

      {/* What you get section */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Everything you need to launch big</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Each tier is designed to maximise your product's reach at every stage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Priority Placement',
                color: 'text-blue-500 bg-blue-500/10',
                desc: 'Premium listings appear at the top of the weekly board during your entire launch week, above free listings.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                color: 'text-emerald-500 bg-emerald-500/10',
                desc: 'Track real-time views, unique visitors, and upvote velocity on your product page dashboard.',
              },
              {
                icon: BookOpen,
                title: 'AI Blog Article',
                color: 'text-purple-500 bg-purple-500/10',
                desc: 'A ~1500-word, SEO-optimised article generated by Claude AI, published to /blog with 3–4 dofollow backlinks to your site.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card rounded-2xl p-6 border border-border/50">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 text-center">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to launch?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start free today and upgrade whenever you're ready to go bigger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
            >
              Submit your product
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-base hover:bg-secondary/80 transition-colors"
            >
              Browse launches
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
