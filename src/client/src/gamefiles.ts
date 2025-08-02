import { loadAsync } from 'jszip';
import { get, set } from 'idb-keyval';

const FILE_KEY = 'gamefiles.zip';

export async function getGameFiles() {
  const cacheHit = await get<ArrayBuffer>(FILE_KEY);
  if (cacheHit) {
    return loadAsync(cacheHit);
  }
  const response = await fetch(FILE_KEY);
  const buffer = await response.arrayBuffer();
  await set(FILE_KEY, buffer);
  return loadAsync(buffer);
}
