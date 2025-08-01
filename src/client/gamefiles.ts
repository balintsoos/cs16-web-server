import { loadAsync } from 'jszip';

const CACHE_KEY = 'gamefiles-cache';
const CACHE_FILE_NAME = 'gamefiles.zip';

export async function getGameFiles() {
  const cache = await caches.open(CACHE_KEY);
  const cacheHit = await cache.match(CACHE_FILE_NAME);

  if (cacheHit) {
    const buffer = await cacheHit.arrayBuffer();
    return loadAsync(buffer);
  }

  const response = await fetch('/gamefiles.zip');
  const buffer = await response.arrayBuffer();
  await cache.put(CACHE_FILE_NAME, new Response(buffer));
  return loadAsync(buffer);
}
