"use client";

import { useState } from "react";
import { Check, X, Edit2, Loader2 } from "lucide-react";
import Image from "next/image";

export function AdminSubmissionRow({ sub }: { sub: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(sub.status);
  const [listingUrl, setListingUrl] = useState(sub.listingUrl || "");
  const [screenshotUrl, setScreenshotUrl] = useState(sub.screenshotUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/directory-submissions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, listingUrl, screenshotUrl }),
      });
      
      if (!res.ok) throw new Error("Failed to update");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <tr className="hover:bg-muted/5 transition-colors">
        <td className="px-6 py-4">
          <div className="font-semibold text-primary">{sub.product.name}</div>
          <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
            {sub.product.websiteUrl}
          </div>
        </td>
        <td className="px-6 py-4 font-medium">{sub.directoryName}</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground">
            {status}
          </span>
        </td>
        <td className="px-6 py-4">
          {listingUrl ? (
            <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[150px] inline-block">
              {listingUrl}
            </a>
          ) : (
            <span className="text-muted-foreground italic">None</span>
          )}
        </td>
        <td className="px-6 py-4">
          {screenshotUrl ? (
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="block relative w-12 h-8 rounded border border-border/50">
              <Image src={screenshotUrl} alt="Screenshot" fill className="object-cover" />
            </a>
          ) : (
            <span className="text-muted-foreground italic">None</span>
          )}
        </td>
        <td className="px-6 py-4">
          <button onClick={() => setIsEditing(true)} className="p-1.5 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors">
            <Edit2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-muted/10 border-l-2 border-primary">
      <td className="px-6 py-4">
        <div className="font-semibold">{sub.product.name}</div>
        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{sub.product.websiteUrl}</div>
      </td>
      <td className="px-6 py-4 font-medium">{sub.directoryName}</td>
      <td className="px-6 py-4">
        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-2 py-1 text-sm rounded border border-border/50 bg-background">
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="live">Live</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <input 
          type="url" 
          placeholder="https://..." 
          value={listingUrl} 
          onChange={e => setListingUrl(e.target.value)}
          className="w-full px-2 py-1 text-sm rounded border border-border/50 bg-background"
        />
      </td>
      <td className="px-6 py-4">
        <input 
          type="url" 
          placeholder="Screenshot URL" 
          value={screenshotUrl} 
          onChange={e => setScreenshotUrl(e.target.value)}
          className="w-full px-2 py-1 text-sm rounded border border-border/50 bg-background"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={isSaving} className="p-1.5 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </button>
          <button onClick={() => setIsEditing(false)} disabled={isSaving} className="p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
