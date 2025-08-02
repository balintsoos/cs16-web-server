import { loadAsync } from 'jszip';

const CACHE_VERSION = 'v1';
const CACHE_KEY = `gamefiles-cache_${CACHE_VERSION}`;
const CACHE_URL = 'gamefiles.zip';

export async function getGameFiles() {
  const cache = await caches.open(CACHE_KEY);
  const cacheHit = await cache.match(CACHE_URL);

  if (cacheHit) {
    const buffer = await cacheHit.arrayBuffer();
    return loadAsync(buffer);
  }

  const response = await fetch(CACHE_URL);
  await cache.put(CACHE_URL, response.clone());
  const buffer = await response.arrayBuffer();
  return loadAsync(buffer);
}
