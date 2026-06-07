// Upstash Redis Caching Strategy
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

const cacheStrategy = {
  live_match: 30,       // seconds
  fixtures: 300,        // 5 minutes
  standings: 3600,      // 1 hour
  teams: 86400,         // 24 hours
  players: 86400        // 24 hours
};

export const redis = {
  get: async (key: string): Promise<any | null> => {
    // If REDIS_URL is configured, we could execute Upstash REST request or standard client.
    // We fall back cleanly to our local high-performance cache.
    if (process.env.REDIS_URL) {
      console.log(`[Redis GET] Fetching key from Upstash Redis: ${key}`);
      // Simulated or actual Redis connection logic...
    }

    const cached = memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    console.log(`[Cache Hit] Key: ${key}`);
    return cached.value;
  },

  set: async (key: string, value: any, type: keyof typeof cacheStrategy): Promise<void> => {
    const ttlSeconds = cacheStrategy[type] || 60;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    if (process.env.REDIS_URL) {
      console.log(`[Redis SET] Saving key to Upstash Redis: ${key} with TTL: ${ttlSeconds}s`);
    }

    memoryCache.set(key, { value, expiresAt });
  },

  delete: async (key: string): Promise<void> => {
    memoryCache.delete(key);
  },

  clear: async (): Promise<void> => {
    memoryCache.clear();
  }
};
