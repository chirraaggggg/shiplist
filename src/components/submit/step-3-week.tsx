"use client";

import { useState, useMemo } from "react";
import { format, addWeeks, startOfWeek, getISOWeek, getYear } from "date-fns";
import { Calendar, CheckCircle2, Zap, Rocket } from "lucide-react";
import { ProductFormData } from "./types";

interface Step3Props {
  data: ProductFormData;
  onNext: (data: Partial<ProductFormData>) => void;
  onBack: () => void;
}

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Standard listing in the directory",
    features: ["Listed for chosen week", "Basic SEO optimized", "Community comments"],
    icon: Calendar,
    color: "bg-muted",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    description: "Boost your visibility",
    features: ["Everything in Free", "Dofollow backlink", "Featured badge", "Newsletter mention"],
    icon: Zap,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/50",
    popular: true,
  },
  {
    id: "premium_plus",
    name: "Premium+",
    price: "$299",
    description: "Maximum launch impact",
    features: ["Everything in Premium", "Top of page placement", "Dedicated social post", "Homepage feature for 1 month"],
    icon: Rocket,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/50",
  },
];

export function Step3Week({ data, onNext, onBack }: Step3Props) {
  const [selectedWeek, setSelectedWeek] = useState(data.launchWeek);
  const [selectedTier, setSelectedTier] = useState<"free" | "premium" | "premium_plus">(data.tier || "free");

  // Generate upcoming 8 weeks
  const upcomingWeeks = useMemo(() => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 1; i <= 8; i++) {
      const weekDate = addWeeks(now, i);
      const start = startOfWeek(weekDate, { weekStartsOn: 1 });
      const isoWeek = getISOWeek(start);
      const year = getYear(start);
      
      const isFull = i === 2 || i === 3; // Mocking some weeks as full
      
      weeks.push({
        id: `${year}-W${isoWeek}`,
        label: `Week ${isoWeek} (${format(start, "MMM d")})`,
        isFull,
        spotsLeft: isFull ? 0 : Math.floor(Math.random() * 20) + 1,
      });
    }
    return weeks;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWeek) return;
    onNext({ launchWeek: selectedWeek, tier: selectedTier });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Choose your launch week</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We curate launches to ensure everyone gets visibility. Pick an upcoming week and optionally boost your launch.
        </p>
      </div>

      <div className="space-y-10">
        {/* Week Picker */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Select Launch Week
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {upcomingWeeks.map((week) => {
              const isSelected = selectedWeek === week.id;
              return (
                <button
                  key={week.id}
                  type="button"
                  disabled={week.isFull}
                  onClick={() => setSelectedWeek(week.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    week.isFull
                      ? "opacity-50 bg-muted border-transparent cursor-not-allowed"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-card hover:border-border/80"
                  }`}
                >
                  <div className="font-semibold">{week.label}</div>
                  <div className={`text-xs mt-1 ${week.isFull ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {week.isFull ? "Week full (30/30)" : `${week.spotsLeft} spots left`}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Tier</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id as any)}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? "border-primary shadow-md bg-card ring-1 ring-primary/20" 
                      : "border-border/50 bg-card hover:border-border/80"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 inset-x-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </span>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${tier.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-xl">{tier.name}</h4>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-3xl font-extrabold">{tier.price}</span>
                    {tier.price !== "$0" && <span className="text-muted-foreground text-sm font-medium">/launch</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 h-10">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`w-full py-2.5 rounded-lg text-center font-semibold text-sm transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {isSelected ? "Selected" : "Select Tier"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-border/50 font-medium hover:bg-muted transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!selectedWeek}
          className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Summary
        </button>
      </div>
    </form>
  );
}
