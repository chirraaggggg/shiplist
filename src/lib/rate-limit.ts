import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// In-memory fallback rate limiter for development when Upstash credentials aren't set
class MemoryRatelimit {
  private requests: Map<string, number[]> = new Map();

  async limit(identifier: string) {
    const now = Date.now();
    const windowMs = 1000; // 1 second sliding window
    const maxRequests = 1;

    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      return { success: false, remaining: 0, reset: now + windowMs };
    }

    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);
    return { success: true, remaining: maxRequests - validTimestamps.length, reset: now + windowMs };
  }
}

let ratelimiter: { limit: (identifier: string) => Promise<{ success: boolean }> };

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "1 s"),
    analytics: true,
  });
} else {
  ratelimiter = new MemoryRatelimit();
}

/**
 * Checks if a user has exceeded the rate limit (1 action per second).
 * @param userId Unique ID of the user
 * @param action Action name (e.g., 'upvote', 'comment')
 * @returns boolean true if allowed, false if rate limited
 */
export async function checkRateLimit(userId: string, action: string = "action"): Promise<boolean> {
  const identifier = `${action}:${userId}`;
  const { success } = await ratelimiter.limit(identifier);
  return success;
}
