export type Maker = {
  name: string;
  avatar: string;
  profileUrl: string;
};

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  body: string;
  createdAt: string;
  replies?: Comment[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  categories: string[];
  tags: string[];
  upvotes: number;
  hasDofollowBadge: boolean;
  websiteUrl: string;
  screenshots: string[];
  maker: Maker;
  launchWeek: string;
  pricingType: "free" | "freemium" | "paid" | "open_source";
  comments: Comment[];
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "stripe",
    name: "Stripe",
    tagline: "Financial infrastructure for the internet",
    description: `## What is Stripe?

Stripe is a **payments infrastructure company** that provides software and APIs that allow businesses to accept online payments and run their financial operations.

### Key Features

- **Payment Links** — Accept one-time or recurring payments without writing any code.
- **Connect** — Build multi-party payment flows and marketplaces.
- **Billing** — Subscriptions, invoicing, and revenue recovery tools built in.
- **Radar** — Machine learning-powered fraud detection trained on data from millions of businesses.

### Why Stripe?

Whether you're a startup launching your first product or an enterprise processing billions, Stripe's unified platform handles payments, tax, subscriptions, and more — so you can focus on building your product, not your payment infrastructure.

> "Stripe has been the backbone of our payments for 5 years. It just works." — Happy customer`,
    logo: "https://ui-avatars.com/api/?name=Stripe&background=6B21A8&color=fff",
    categories: ["Fintech", "Developer Tools"],
    tags: ["payments", "api", "saas", "billing"],
    upvotes: 2450,
    hasDofollowBadge: true,
    websiteUrl: "https://stripe.com",
    screenshots: [
      "https://ui-avatars.com/api/?name=Dashboard&background=6B21A8&color=fff&size=1200",
      "https://ui-avatars.com/api/?name=Analytics&background=4C1D95&color=fff&size=1200",
      "https://ui-avatars.com/api/?name=Payments&background=7C3AED&color=fff&size=1200",
    ],
    maker: {
      name: "Patrick Collison",
      avatar: "https://ui-avatars.com/api/?name=PC&background=6B21A8&color=fff",
      profileUrl: "/maker/patrick-collison",
    },
    launchWeek: "2026-W31",
    pricingType: "paid",
    comments: [
      {
        id: "c1",
        author: "Alex Chen",
        avatar: "https://ui-avatars.com/api/?name=AC&background=0F766E&color=fff",
        body: "Game-changing product. We switched from Braintree and never looked back.",
        createdAt: "2026-07-29T10:22:00Z",
        replies: [
          {
            id: "c1r1",
            author: "Stripe Team",
            avatar: "https://ui-avatars.com/api/?name=ST&background=6B21A8&color=fff",
            body: "Thanks Alex! Really glad to hear the switch has been smooth.",
            createdAt: "2026-07-29T11:05:00Z",
          },
        ],
      },
      {
        id: "c2",
        author: "Maria Silva",
        avatar: "https://ui-avatars.com/api/?name=MS&background=DC2626&color=fff",
        body: "The documentation is top-notch. Integrated in under an hour.",
        createdAt: "2026-07-28T15:44:00Z",
      },
    ],
  },
  {
    id: "2",
    slug: "linear",
    name: "Linear",
    tagline: "A better way to build products",
    description: `## Linear — Purpose-built for Product Teams

Linear is a **project management tool** designed for modern software teams. It's built around speed, clarity, and beautiful design.

### What Makes Linear Different

- **Blazing fast** — Designed for keyboard shortcuts and instant interactions.
- **Git-sync** — Link issues to branches, commits, and PRs automatically.
- **Cycles** — Focused sprints that give teams a clear north star.
- **Triage** — A dedicated inbox that keeps your backlog clean.

### For Developers & PMs Alike

Stop drowning in JIRA tickets. Linear's clean interface means you spend less time managing your project manager and more time shipping.`,
    logo: "https://ui-avatars.com/api/?name=Linear&background=5E6AD2&color=fff",
    categories: ["Productivity", "SaaS"],
    tags: ["project-management", "engineering", "startup"],
    upvotes: 1842,
    hasDofollowBadge: true,
    websiteUrl: "https://linear.app",
    screenshots: [
      "https://ui-avatars.com/api/?name=Issues&background=5E6AD2&color=fff&size=1200",
      "https://ui-avatars.com/api/?name=Roadmap&background=4F5CB8&color=fff&size=1200",
    ],
    maker: {
      name: "Karri Saarinen",
      avatar: "https://ui-avatars.com/api/?name=KS&background=5E6AD2&color=fff",
      profileUrl: "/maker/karri-saarinen",
    },
    launchWeek: "2026-W31",
    pricingType: "freemium",
    comments: [
      {
        id: "c3",
        author: "Dev Patel",
        avatar: "https://ui-avatars.com/api/?name=DP&background=0369A1&color=fff",
        body: "We left Notion for Linear and our whole engineering team is much happier.",
        createdAt: "2026-07-30T09:10:00Z",
      },
    ],
  },
  {
    id: "3",
    slug: "vercel",
    name: "Vercel",
    tagline: "Develop. Preview. Ship.",
    description: `## Deploy the Web, Faster

Vercel is the **cloud platform for frontend teams** that provides the developer experience and infrastructure to build, scale, and secure a faster, more personalized web.

### Core Features

- **Zero-config deployments** — Push to git, get a live preview URL instantly.
- **Edge Network** — Your content is served from the closest edge location globally.
- **Analytics** — Real User Monitoring (RUM) built directly into the platform.
- **v0** — AI-powered UI generation that deploys directly to Vercel.`,
    logo: "https://ui-avatars.com/api/?name=Vercel&background=171717&color=fff",
    categories: ["Developer Tools", "Hosting"],
    tags: ["deployment", "frontend", "edge", "cloud"],
    upvotes: 1430,
    hasDofollowBadge: false,
    websiteUrl: "https://vercel.com",
    screenshots: [
      "https://ui-avatars.com/api/?name=Deploy&background=171717&color=fff&size=1200",
      "https://ui-avatars.com/api/?name=Analytics&background=333&color=fff&size=1200",
    ],
    maker: {
      name: "Guillermo Rauch",
      avatar: "https://ui-avatars.com/api/?name=GR&background=171717&color=fff",
      profileUrl: "/maker/guillermo-rauch",
    },
    launchWeek: "2026-W31",
    pricingType: "freemium",
    comments: [],
  },
  {
    id: "4",
    slug: "notion",
    name: "Notion",
    tagline: "One workspace. Every team.",
    description: `## The All-in-One Workspace

Notion is a **connected workspace** where better, faster work happens. Used by teams at Figma, Pixar, and thousands of startups worldwide.

### Features at a Glance

- **Docs** — Rich-text documents with blocks, embeds, and databases.
- **Databases** — Tables, boards, calendars and galleries — all connected.
- **AI** — Ask Notion AI to summarize, translate, or write anything.
- **Templates** — 10,000+ community templates for every use case.`,
    logo: "https://ui-avatars.com/api/?name=Notion&background=F3F2EE&color=000",
    categories: ["Productivity", "Notes"],
    tags: ["notes", "wiki", "docs", "collaboration"],
    upvotes: 1205,
    hasDofollowBadge: false,
    websiteUrl: "https://notion.so",
    screenshots: [
      "https://ui-avatars.com/api/?name=Pages&background=F3F2EE&color=333&size=1200",
    ],
    maker: {
      name: "Ivan Zhao",
      avatar: "https://ui-avatars.com/api/?name=IZ&background=F3F2EE&color=000",
      profileUrl: "/maker/ivan-zhao",
    },
    launchWeek: "2026-W30",
    pricingType: "freemium",
    comments: [],
  },
  {
    id: "5",
    slug: "resend",
    name: "Resend",
    tagline: "Email for developers",
    description: `## The Email API for Developers

Resend is the **email API** built for developer experience. Send transactional emails with React, TypeScript, and your favourite tools.

### Why Developers Love Resend

- **React Email** — Build beautiful emails with React components.
- **Simple API** — Send your first email in under 5 minutes.
- **Open source** — The underlying React Email library is fully open source.
- **Dashboard** — View logs, delivery stats, and manage domains in one place.`,
    logo: "https://ui-avatars.com/api/?name=Resend&background=000&color=fff",
    categories: ["Developer Tools", "Email"],
    tags: ["email", "transactional", "react", "api"],
    upvotes: 980,
    hasDofollowBadge: true,
    websiteUrl: "https://resend.com",
    screenshots: [
      "https://ui-avatars.com/api/?name=Email&background=000&color=fff&size=1200",
      "https://ui-avatars.com/api/?name=Logs&background=111&color=fff&size=1200",
    ],
    maker: {
      name: "Zeno Rocha",
      avatar: "https://ui-avatars.com/api/?name=ZR&background=000&color=fff",
      profileUrl: "/maker/zeno-rocha",
    },
    launchWeek: "2026-W31",
    pricingType: "freemium",
    comments: [
      {
        id: "c4",
        author: "Jake Williams",
        avatar: "https://ui-avatars.com/api/?name=JW&background=CA8A04&color=fff",
        body: "React Email is the best thing to happen to HTML email since... nothing. There was nothing good before.",
        createdAt: "2026-07-27T12:00:00Z",
      },
    ],
  },
  {
    id: "6",
    slug: "cursor",
    name: "Cursor",
    tagline: "The AI-first code editor",
    description: `## Code Faster with AI

Cursor is a **fork of VS Code** with a deeply integrated AI copilot that understands your entire codebase — not just the current file.

### Core Capabilities

- **Tab completion** — Multi-line completions that predict your next edit.
- **Cmd+K** — Edit code in natural language with inline generation.
- **Chat** — Ask questions about your codebase, get answers with context.
- **@ symbols** — Reference files, functions, and docs directly in the chat.`,
    logo: "https://ui-avatars.com/api/?name=Cursor&background=1C1C1C&color=fff",
    categories: ["AI", "Developer Tools"],
    tags: ["ai", "editor", "vscode", "coding"],
    upvotes: 2100,
    hasDofollowBadge: true,
    websiteUrl: "https://cursor.sh",
    screenshots: [
      "https://ui-avatars.com/api/?name=Editor&background=1C1C1C&color=fff&size=1200",
    ],
    maker: {
      name: "Aman Sanger",
      avatar: "https://ui-avatars.com/api/?name=AS&background=1C1C1C&color=fff",
      profileUrl: "/maker/aman-sanger",
    },
    launchWeek: "2026-W31",
    pricingType: "freemium",
    comments: [],
  },
];

// Helper: get current ISO week string e.g. "2026-W31"
export function getCurrentISOWeek(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function getProductsByWeek(week: string): Product[] {
  return MOCK_PRODUCTS
    .filter((p) => p.launchWeek === week)
    .sort((a, b) => b.upvotes - a.upvotes);
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
