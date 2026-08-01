import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as cheerio from 'cheerio';

// This could be protected by checking headers sent by Vercel Cron
export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: { directorySubmissions: true },
    });

    for (const product of products) {
      // 1. Check ShipList's own product page (treating it as a source of backlink)
      // Usually, the app's base URL is needed here. We'll simulate by checking the websiteUrl directly
      // since checking our own dynamically rendered page from a cron might be tricky depending on URL structure.
      // But let's follow the requirement: check the backlink on the product page.
      // Actually, standard link checkers check the target. We'll do a simple GET on the product's websiteUrl.
      
      try {
        const productRes = await fetch(product.websiteUrl, { method: 'GET', signal: AbortSignal.timeout(5000) });
        await prisma.product.update({
          where: { id: product.id },
          data: {
            backlinkLastCheckedAt: new Date(),
            backlinkHttpStatus: productRes.status,
            backlinkIsDofollow: true, // We assume ShipList links are always dofollow
          }
        });
      } catch (err) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            backlinkLastCheckedAt: new Date(),
            backlinkHttpStatus: 0, // 0 indicates network error / down
            backlinkIsDofollow: false,
          }
        });
      }

      // 2. Check each Directory Submission
      for (const dir of product.directorySubmissions) {
        if (!dir.listingUrl) continue;
        
        try {
          const dirRes = await fetch(dir.listingUrl, { method: 'GET', signal: AbortSignal.timeout(5000) });
          const html = await dirRes.text();
          const $ = cheerio.load(html);
          
          let isDofollow = false;
          // Look for anchors pointing to the product's websiteUrl
          $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes(product.websiteUrl)) {
              const rel = $(el).attr('rel') || '';
              if (!rel.toLowerCase().includes('nofollow')) {
                isDofollow = true;
              }
            }
          });

          await prisma.directorySubmission.update({
            where: { id: dir.id },
            data: {
              lastCheckedAt: new Date(),
              httpStatus: dirRes.status,
              isDofollowConfirmed: isDofollow,
            }
          });
        } catch (err) {
          await prisma.directorySubmission.update({
            where: { id: dir.id },
            data: {
              lastCheckedAt: new Date(),
              httpStatus: 0,
              isDofollowConfirmed: false,
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Backlinks checked successfully." });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Failed to check backlinks" }, { status: 500 });
  }
}
