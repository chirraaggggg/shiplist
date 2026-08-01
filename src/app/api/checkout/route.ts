import { Checkout } from '@dodopayments/nextjs';

export const POST = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || 'test_mode',
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || 'http://localhost:3000/checkout/success',
  type: 'dynamic',
});
