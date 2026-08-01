import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function BacklinksDashboard() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Use the clerkId or user.id depending on how the schema links it
  // Since we added makerId to Product, let's assume it maps to user.id
  const products = await prisma.product.findMany({
    where: { makerId: user.id },
    include: { directorySubmissions: true },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Backlink Health</h1>
          <p className="text-muted-foreground mt-2">
            Monitor the live status of the backlinks your products have earned across the web.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="p-8 border border-border/50 rounded-2xl bg-card text-center">
            <p className="text-muted-foreground">You have not submitted any products yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {products.map((product) => {
              const allLinks = [
                {
                  id: `product-${product.id}`,
                  url: `/product/${product.slug}`,
                  target: product.websiteUrl,
                  source: "ShipList",
                  status: product.backlinkHttpStatus,
                  dofollow: product.backlinkIsDofollow,
                  lastCheckedAt: product.backlinkLastCheckedAt,
                },
                ...product.directorySubmissions.map((dir) => ({
                  id: `dir-${dir.id}`,
                  url: dir.listingUrl,
                  target: product.websiteUrl,
                  source: dir.directoryName,
                  status: dir.httpStatus,
                  dofollow: dir.isDofollowConfirmed,
                  lastCheckedAt: dir.lastCheckedAt,
                })),
              ];

              return (
                <div key={product.id} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{product.name}</h2>
                      <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1">
                        {product.websiteUrl} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/10 border-b border-border/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4 font-medium">Source</th>
                          <th className="px-6 py-4 font-medium">Backlink URL</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Indexation</th>
                          <th className="px-6 py-4 font-medium">Last Checked</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {allLinks.map((link) => {
                          const isLive = link.status === 200;
                          const isDofollow = link.dofollow;
                          
                          let statusPill = (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              Pending
                            </span>
                          );

                          if (link.lastCheckedAt) {
                            if (!isLive) {
                              statusPill = (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                                  <XCircle className="h-3.5 w-3.5" /> Down ({link.status})
                                </span>
                              );
                            } else if (isLive && !isDofollow) {
                              statusPill = (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                                  <AlertCircle className="h-3.5 w-3.5" /> Live but Nofollow
                                </span>
                              );
                            } else {
                              statusPill = (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Live & Dofollow
                                </span>
                              );
                            }
                          }

                          return (
                            <tr key={link.id} className="hover:bg-muted/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{link.source}</td>
                              <td className="px-6 py-4">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 truncate max-w-[200px]">
                                  {link.url}
                                </a>
                              </td>
                              <td className="px-6 py-4">
                                {statusPill}
                              </td>
                              <td className="px-6 py-4">
                                <a 
                                  href={`https://www.google.com/search?q=site:${encodeURIComponent(link.url)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/50 hover:bg-muted transition-colors text-xs font-medium"
                                >
                                  Check Indexation <ExternalLink className="h-3 w-3" />
                                </a>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                {link.lastCheckedAt ? new Date(link.lastCheckedAt).toLocaleDateString() : "Never"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
