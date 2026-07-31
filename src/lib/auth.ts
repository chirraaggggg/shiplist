import { auth, currentUser } from "@clerk/nextjs/server";

export type SessionUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
};

// Mock user for local testing when Clerk keys are not set
const MOCK_USER: SessionUser = {
  id: "user_mock_123",
  clerkId: "clerk_mock_123",
  email: "demo@shiplist.com",
  name: "Demo Maker",
  role: "ADMIN", // Admin by default in dev mock mode to test deletion
  createdAt: new Date(Date.now() - 3600 * 1000 * 2), // Created 2 hours ago
};

/**
 * Retrieves the current authenticated user session.
 * Integrates with Clerk when configured, otherwise falls back to a development session.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      // In dev mode without Clerk set up, return mock user
      if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        return MOCK_USER;
      }
      return null;
    }

    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@shiplist.internal`;

    return {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User',
      role: (clerkUser.publicMetadata?.role as "ADMIN" | "USER") || "USER",
      createdAt: new Date(clerkUser.createdAt),
    };
  } catch (error) {
    // If Clerk is not configured or throws error in server environment
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return MOCK_USER;
    }
    return null;
  }
}
