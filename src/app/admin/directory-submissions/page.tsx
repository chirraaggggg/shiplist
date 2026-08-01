import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminDirectorySubmissions() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/"); // Not authorized
  }

  const submissions = await prisma.directorySubmission.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Directory Submissions</h1>
            <p className="text-muted-foreground mt-2">
              Admin view of all Chunk 9 directory submissions and their live health.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/10 border-b border-border/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Directory</th>
                  <th className="px-6 py-4 font-medium">Listing URL</th>
                  <th className="px-6 py-4 font-medium">Health Status</th>
                  <th className="px-6 py-4 font-medium">Last Checked</th>
                  <th className="px-6 py-4 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No directory submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const isLive = sub.httpStatus === 200;
                    const isDofollow = sub.isDofollowConfirmed;
                    
                    let statusPill = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        Pending
                      </span>
                    );

                    if (sub.lastCheckedAt) {
                      if (!isLive) {
                        statusPill = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            <XCircle className="h-3.5 w-3.5" /> Down ({sub.httpStatus})
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
                      <tr key={sub.id} className="hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/product/${sub.product.slug}`} className="font-semibold text-primary hover:underline">
                            {sub.product.name}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
                            {sub.product.websiteUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{sub.directoryName}</td>
                        <td className="px-6 py-4">
                          {sub.listingUrl ? (
                            <a href={sub.listingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 truncate max-w-[200px]">
                              {sub.listingUrl}
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {statusPill}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {sub.lastCheckedAt ? new Date(sub.lastCheckedAt).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
