import { Webhooks } from '@dodopayments/nextjs';
import { prisma } from '@/lib/db';
import { waitUntil } from '@vercel/functions';
import { generateBlogPost } from '@/lib/ai/generate-post';

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onPaymentSucceeded: async (event) => {
    try {
      const payload = event.data;
      
      // Metadata passed during checkout
      const metadata = payload.metadata as {
        productId?: string;
        userId?: string;
        tier?: string;
      } | null;

      if (!metadata || !metadata.productId || !metadata.userId || !metadata.tier) {
        console.error("Missing metadata in Dodo Payments webhook", payload);
        return;
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: metadata.userId,
          productId: metadata.productId,
          tier: metadata.tier,
          amount: payload.total_amount || 0,
          dodoPaymentId: payload.payment_id,
          status: 'succeeded'
        }
      });

      // Update product
      const isPremium = metadata.tier === 'premium' || metadata.tier === 'premium_plus';
      const isPremiumPlus = metadata.tier === 'premium_plus';

      await prisma.product.update({
        where: { id: metadata.productId },
        data: {
          isPremium,
          isPremiumPlus
        }
      });

      // If Premium+, dispatch a background job to generate the blog post
      if (isPremiumPlus) {
        waitUntil(generateBlogPost(metadata.productId));
      }

      console.log(`Payment succeeded for product ${metadata.productId}`);
    } catch (err) {
      console.error("Error processing dodo payment webhook:", err);
    }
  }
});
