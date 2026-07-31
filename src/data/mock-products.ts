export type Product = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  categories: string[];
  upvotes: number;
  hasDofollowBadge: boolean;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Stripe",
    tagline: "Financial infrastructure for the internet",
    logo: "https://ui-avatars.com/api/?name=Stripe&background=6B21A8&color=fff",
    categories: ["Fintech", "Developer Tools"],
    upvotes: 2450,
    hasDofollowBadge: true,
  },
  {
    id: "2",
    name: "Linear",
    tagline: "A better way to build products",
    logo: "https://ui-avatars.com/api/?name=Linear&background=000&color=fff",
    categories: ["Productivity", "SaaS"],
    upvotes: 1842,
    hasDofollowBadge: true,
  },
  {
    id: "3",
    name: "Vercel",
    tagline: "Develop. Preview. Ship.",
    logo: "https://ui-avatars.com/api/?name=Vercel&background=000&color=fff",
    categories: ["Developer Tools", "Hosting"],
    upvotes: 1430,
    hasDofollowBadge: false,
  },
  {
    id: "4",
    name: "Notion",
    tagline: "One workspace. Every team.",
    logo: "https://ui-avatars.com/api/?name=Notion&background=fff&color=000",
    categories: ["Productivity", "Notes"],
    upvotes: 1205,
    hasDofollowBadge: false,
  },
  {
    id: "5",
    name: "Resend",
    tagline: "Email for developers",
    logo: "https://ui-avatars.com/api/?name=Resend&background=000&color=fff",
    categories: ["Developer Tools", "Email"],
    upvotes: 980,
    hasDofollowBadge: true,
  }
];
