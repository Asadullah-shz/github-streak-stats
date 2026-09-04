import { Redis } from '@upstash/redis';
import { after } from 'next/server';

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisInstance !== null) {
    return redisInstance;
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    redisInstance = new Redis({ url: redisUrl, token: redisToken });
  }

  return redisInstance;
}

interface CacheEnvelope<T> {
  data: T;
  ts: number; // epoch ms this entry was written
}

/**
 * Stale-while-revalidate read-through cache. This is what makes the SVG
 * respond instantly on essentially every view instead of only on views
 * that happen to land inside a short TTL window:
 *
 * - No cached entry at all      -> fetch synchronously (only a brand-new
 *                                   profile ever pays this; unavoidable).
 * - Entry younger than fresh    -> serve it, nothing else happens.
 * - Entry older than fresh but
 *   younger than stale          -> serve it IMMEDIATELY, then kick off a
 *                                   background refetch via `after()`. The
 *                                   viewer never waits on GitHub; the next
 *                                   viewer gets the refreshed data.
 * - Entry older than stale      -> treated as a miss, fetched synchronously.
 *   `staleSeconds` is set generously by callers specifically so this case
 *   is rare — it only happens if a profile goes unviewed for days.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: { freshSeconds: number; staleSeconds: number }
): Promise<T> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get<CacheEnvelope<T> | string>(key);
      const envelope: CacheEnvelope<T> | null = raw
        ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
        : null;

      if (envelope) {
        const ageSeconds = (Date.now() - envelope.ts) / 1000;

        if (ageSeconds < opts.staleSeconds) {
          if (ageSeconds >= opts.freshSeconds) {
            // Serve the still-usable-but-aging copy now; refresh in the
            // background after the response has already gone out.
            after(async () => {
              try {
                const fresh = await fetcher();
                if (fresh) {
                  await redis.setex(
                    key,
                    opts.staleSeconds,
                    JSON.stringify({ data: fresh, ts: Date.now() })
                  );
                }
              } catch (e) {
                console.error('Background revalidation failed:', e);
              }
            });
          }
          return envelope.data;
        }
      }
    } catch (e) {
      console.error('Redis cache GET error:', e);
    }
  }

  // True cache miss (or Redis unavailable) — the only path that actually
  // waits on GitHub.
  const fresh = await fetcher();

  if (redis && fresh) {
    try {
      await redis.setex(
        key,
        opts.staleSeconds,
        JSON.stringify({ data: fresh, ts: Date.now() })
      );
    } catch (e) {
      console.error('Redis cache SET error:', e);
    }
  }

  return fresh;
}
