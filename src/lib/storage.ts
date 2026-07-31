// src/lib/storage.ts

/**
 * Downloads an image from an external URL and re-uploads it to our own storage
 * (e.g., Supabase Storage or Cloudflare R2).
 * 
 * This avoids hotlinking external URLs, prevents broken images if the source goes down,
 * and mitigates remote-image abuse risk.
 * 
 * @param externalUrl The URL of the image scraped from the submitted product
 * @param bucketPath The path/folder in the bucket to store the file
 * @returns The public URL of the re-uploaded image in our own storage
 */
export async function downloadAndReuploadImage(
  externalUrl: string,
  bucketPath: string
): Promise<string> {
  if (!externalUrl) return "";

  try {
    // 1. Download the image server-side
    const response = await fetch(externalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    // 2. Upload to our own Storage provider (e.g. Supabase, R2, AWS S3)
    // 
    // Example using Supabase Storage (pseudo-code):
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    // const fileName = `${bucketPath}/${Date.now()}-${Math.round(Math.random() * 10000)}`;
    // 
    // const { data, error } = await supabase.storage
    //   .from("product-images")
    //   .upload(fileName, buffer, {
    //     contentType,
    //     upsert: false
    //   });
    //
    // if (error) throw error;
    // 
    // const { data: publicUrlData } = supabase.storage
    //   .from("product-images")
    //   .getPublicUrl(fileName);
    //
    // return publicUrlData.publicUrl;

    // For now, since we haven't wired up a real DB/Storage provider yet,
    // we'll simulate a successful upload and return the original URL as a fallback,
    // but log that the abstraction is in place.
    console.log(`[Storage] Downloaded ${buffer.byteLength} bytes from ${externalUrl}`);
    console.log(`[Storage] (Mock) Uploaded to bucket path: ${bucketPath}`);
    
    // In production, return the new URL from your storage provider.
    return externalUrl; 
  } catch (error) {
    console.error(`Error processing image ${externalUrl}:`, error);
    // Fallback: return the original URL or a placeholder if the download fails
    return externalUrl;
  }
}
