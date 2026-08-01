/**
 * Customer Portal Route Handler — Scaffolded for v2.
 *
 * This route will let makers view and manage their past purchases via
 * the Dodo Payments customer portal. Uncomment and configure when ready.
 *
 * Required env vars:
 *   DODO_PAYMENTS_API_KEY
 *   DODO_PAYMENTS_ENVIRONMENT
 */

import { NextRequest, NextResponse } from 'next/server';
// import { CustomerPortal } from '@dodopayments/nextjs';

// When ready to activate, replace the handler below with:
//
// export const GET = CustomerPortal({
//   bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
//   environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || 'test_mode',
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: 'Customer portal coming soon.' },
    { status: 501 },
  );
}
