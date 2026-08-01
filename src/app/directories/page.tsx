"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ExternalLink, ArrowUpDown } from "lucide-react";
import { DIRECTORY_LISTINGS } from "@/data/directories";

export default function DirectoriesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [pricingFilter, setPricingFilter] = useState("All");
  const [dofollowFilter, setDofollowFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"dr" | "name">("dr");

  const categories = ["All", ...Array.from(new Set(DIRECTORY_LISTINGS.map(d => d.category)))];

  const filtered = useMemo(() => {
    return DIRECTORY_LISTINGS.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || d.category === categoryFilter;
      const matchPricing = pricingFilter === "All" || d.pricing === pricingFilter;
      const matchDofollow = dofollowFilter === "All" 
        ? true 
        : dofollowFilter === "Dofollow" ? d.isDofollow : !d.isDofollow;
      
      return matchSearch && matchCategory && matchPricing && matchDofollow;
    }).sort((a, b) => {
      if (sortBy === "dr") return b.dr - a.dr;
      return a.name.localeCompare(b.name);
    });
  }, [search, categoryFilter, pricingFilter, dofollowFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Top 50+ Startup Directories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the best places to launch your startup, gain backlinks, and drive initial traffic. Use our database to find high Domain Rating (DR) directories.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/directories/submit-for-me"
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Do it for me
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search directories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Pricing</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
            </select>

            <select
              value={dofollowFilter}
              onChange={(e) => setDofollowFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Link Types</option>
              <option value="Dofollow">Dofollow</option>
              <option value="Nofollow">Nofollow</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/10 border-b border-border/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Directory</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => setSortBy(sortBy === "dr" ? "name" : "dr")}>
                    <div className="flex items-center gap-1">
                      DR <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">Link Type</th>
                  <th className="px-6 py-4 font-medium">Pricing</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((dir) => (
                  <tr key={dir.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Use img instead of next/image for external favicons to avoid domain config issues */}
                        <img src={dir.favicon} alt="" className="w-6 h-6 rounded bg-muted/20" onError={(e) => e.currentTarget.style.display='none'} />
                        <span className="font-semibold text-foreground">{dir.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {dir.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {dir.dr}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${dir.isDofollow ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-muted text-muted-foreground border border-border/50'}`}>
                        {dir.isDofollow ? 'Dofollow' : 'Nofollow'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{dir.pricing}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={dir.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                        Submit <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No directories match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <h3 className="text-lg font-bold mb-2">What is directory submission?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Directory submission involves adding your website to various online directories, lists, and aggregators. This helps increase your online visibility, drives referral traffic, and builds a foundational backlink profile for SEO.
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <h3 className="text-lg font-bold mb-2">Dofollow vs Nofollow: What's the difference?</h3>
              <p className="text-muted-foreground leading-relaxed">
                A "dofollow" link passes SEO "link juice" and authority to your website, helping improve your search engine rankings. A "nofollow" link tells search engines not to pass authority, but they can still drive valuable human traffic and are important for a natural-looking backlink profile.
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <h3 className="text-lg font-bold mb-2">Are directory submissions good for SEO in 2026?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, but quality matters over quantity. While spammy directory submissions no longer work, listing your startup on high Domain Rating (DR) sites like Product Hunt, G2, or TechCrunch is highly beneficial for establishing initial entity authority and indexation.
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <h3 className="text-lg font-bold mb-2">Should I submit manually or use an automated tool?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manual submissions are always preferred. Automated tools often submit to low-quality or completely irrelevant spam directories, which can actually harm your SEO. If you don't have time to do it manually, use a trusted done-for-you service.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
