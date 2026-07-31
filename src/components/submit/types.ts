export type ProductFormData = {
  url: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  pricingType: "free" | "freemium" | "paid" | "open_source" | "";
  favicon: string | null;
  ogImage: string | null;
  screenshots: string[]; // mock object URLs
  launchWeek: string; // ISO week string like "2026-W32"
  tier: "free" | "premium" | "premium_plus";
};

export const defaultFormData: ProductFormData = {
  url: "",
  name: "",
  tagline: "",
  description: "",
  category: "",
  tags: [],
  pricingType: "",
  favicon: null,
  ogImage: null,
  screenshots: [],
  launchWeek: "",
  tier: "free",
};
