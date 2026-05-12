/**
 * In-memory data cache with TTL.
 * Used to reduce external API calls for news (RSS) and esports (OpenDota).
 */

interface CacheEntry<T> {
  data: T;
  ts: number;
  ttl: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > entry.ttl) {
    store.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, ts: Date.now(), ttl: ttlMs });
}

export function cacheDelete(pattern?: string): number {
  let count = 0;
  for (const key of store.keys()) {
    if (!pattern || key.includes(pattern)) {
      store.delete(key);
      count++;
    }
  }
  return count;
}

export function cacheKeys(): string[] {
  return [...store.keys()];
}
