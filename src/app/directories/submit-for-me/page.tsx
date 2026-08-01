import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BuyButton } from "./buy-button"; // I will create a client component for the button

export default async function SubmitForMePage() {
  const user = await getSessionUser();
  
  let products: any[] = [];
  if (user) {
    products = await prisma.product.findMany({
      where: { makerId: user.id },
      select: { id: true, name: true }
    });
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Done-For-You Directory Submissions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save 20+ hours of tedious work. Our team will manually submit your startup to the top directories, building your foundational backlinks and driving early traffic.
          </p>
        </div>

        {!user ? (
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Log in to view your products</h3>
            <Link href="/sign-in" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Sign In
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-4">You don't have any products yet</h3>
            <p className="text-muted-foreground mb-6">Submit a product first before purchasing the directory submission service.</p>
            <Link href="/submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Submit a Product
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* 60+ Tier */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col h-full relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">60+ Directories</h3>
                <p className="text-muted-foreground mt-2">Essential backlink foundation.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$149</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Manual submission by our team", "Submission to 60+ top directories", "High DR links included", "Completion in 7-10 days", "Dashboard to track live links"].map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <BuyButton products={products} tier="DIRECTORY_60" />
            </div>

            {/* 120+ Tier */}
            <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-md flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold">120+ Directories</h3>
                <p className="text-muted-foreground mt-2">Maximum SEO authority & traffic.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$249</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Manual submission by our team", "Submission to 120+ directories", "Includes specialized niche sites", "Completion in 10-14 days", "Dashboard to track live links", "Priority support"].map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <BuyButton products={products} tier="DIRECTORY_120" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
