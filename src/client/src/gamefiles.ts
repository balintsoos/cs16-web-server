import { loadAsync } from 'jszip';
import { get, set } from 'idb-keyval';
import { updateStatus } from './overlay';

const FILE_KEY = 'gamefiles.zip';

export async function getGameFiles() {
  const cacheHit = await get<ArrayBuffer>(FILE_KEY);
  if (cacheHit) {
    updateStatus('Loading cached game files...');
    return loadAsync(cacheHit);
  }
  updateStatus('Fetching game files...');
  const response = await fetch(FILE_KEY);
  const buffer = await response.arrayBuffer();
  await set(FILE_KEY, buffer);
  return loadAsync(buffer);
}
