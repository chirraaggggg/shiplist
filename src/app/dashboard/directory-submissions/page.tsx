import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function MakerDirectorySubmissionsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const products = await prisma.product.findMany({
    where: { makerId: user.id },
    include: {
      directorySubmissions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const productsWithSubmissions = products.filter(p => p.directorySubmissions.length > 0);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold">Directory Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Track the status of your "Done-For-You" directory submission service.
          </p>
        </div>

        {productsWithSubmissions.length === 0 ? (
          <div className="p-8 border border-border/50 rounded-3xl bg-card text-center shadow-sm">
            <h3 className="text-xl font-bold mb-4">No submissions yet</h3>
            <p className="text-muted-foreground mb-6">You haven't purchased the directory submission service for any of your products.</p>
            <Link href="/directories/submit-for-me" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Buy Submissions
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {productsWithSubmissions.map(product => (
              <div key={product.id} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-border/50 bg-muted/20">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1">
                    {product.websiteUrl} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/10 border-b border-border/50 text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4 font-medium">Directory</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Screenshot</th>
                        <th className="px-6 py-4 font-medium">Listing Link</th>
                        <th className="px-6 py-4 font-medium">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {product.directorySubmissions.map(sub => {
                        let StatusIcon = Clock;
                        let statusColor = "bg-secondary text-secondary-foreground";
                        
                        if (sub.status.toLowerCase() === "live" || sub.status.toLowerCase() === "submitted") {
                          StatusIcon = CheckCircle2;
                          statusColor = "bg-green-500/10 text-green-600 border border-green-500/20";
                        } else if (sub.status.toLowerCase() === "rejected") {
                          StatusIcon = XCircle;
                          statusColor = "bg-destructive/10 text-destructive border border-destructive/20";
                        }

                        return (
                          <tr key={sub.id} className="hover:bg-muted/5 transition-colors">
                            <td className="px-6 py-4 font-medium">{sub.directoryName}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {sub.screenshotUrl ? (
                                <a href={sub.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block relative w-16 h-10 rounded overflow-hidden border border-border/50 group">
                                  <Image src={sub.screenshotUrl} alt="Screenshot" fill className="object-cover group-hover:opacity-75 transition-opacity" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-xs italic">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {sub.listingUrl ? (
                                <a href={sub.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium">
                                  View <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-xs italic">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
