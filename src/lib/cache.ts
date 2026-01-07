// Super simple in-memory cache for quick demos.
const store = new Map<string, { at: number; ttl: number; value: unknown }>();

export const cache = {
  get<T>(key: string): T | undefined {
    const hit = store.get(key);
    if (!hit) return undefined;
    if (hit.ttl > 0 && Date.now() - hit.at > hit.ttl) {
      store.delete(key);
      return undefined;
    }
    return hit.value as T;
  },
  set<T>(key: string, value: T, ttl = 0) {
    store.set(key, { at: Date.now(), ttl, value });
  },
  clear(key?: string) {
    if (key) store.delete(key);
    else store.clear();
  },
};
