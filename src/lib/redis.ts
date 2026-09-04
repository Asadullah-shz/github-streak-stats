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
  ts: number;
}

function isCacheEnvelope<T>(value: unknown): value is CacheEnvelope<T> {
  if (!value || typeof value !== 'object') return false;
  const envelope = value as Partial<CacheEnvelope<T>>;
  return typeof envelope.ts === 'number' && 'data' in envelope;
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: { freshSeconds: number; staleSeconds: number }
): Promise<T> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get<CacheEnvelope<T> | string>(key);
      let parsed: unknown = raw;
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw) as unknown;
        } catch {
          parsed = null;
        }
      }
      const envelope = isCacheEnvelope<T>(parsed) ? parsed : null;

      if (envelope) {
        const ageSeconds = (Date.now() - envelope.ts) / 1000;
        if (ageSeconds < opts.staleSeconds) {
          if (ageSeconds >= opts.freshSeconds) {
            after(async () => {
              try {
                const fresh = await fetcher();
                if (fresh) {
                  await redis.setex(key, opts.staleSeconds, JSON.stringify({ data: fresh, ts: Date.now() }));
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

  const fresh = await fetcher();
  if (redis && fresh) {
    try {
      await redis.setex(key, opts.staleSeconds, JSON.stringify({ data: fresh, ts: Date.now() }));
    } catch (e) {
      console.error('Redis cache SET error:', e);
    }
  }
  return fresh;
}
