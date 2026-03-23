import * as ImageManipulator from 'expo-image-manipulator';

import type { PokemonDetails } from '../types/pokemon';

/** Docelowy bok ikony na mapie (Android natywny `image` — bez skalowania po stronie mapy). */
const MAX_MARKER_SIDE_PX = 140;

const uriCache = new Map<string, string>();

let cacheRevision = 0;
const cacheListeners = new Set<() => void>();

function notifyMarkerIconCache() {
  cacheRevision += 1;
  cacheListeners.forEach((l) => l());
}

export function subscribeMarkerIconCache(onStoreChange: () => void) {
  cacheListeners.add(onStoreChange);
  return () => cacheListeners.delete(onStoreChange);
}

export function getMarkerIconCacheSnapshot() {
  return cacheRevision;
}

export function getCachedSizedMarkerUri(cacheKey: string): string | undefined {
  return uriCache.get(cacheKey);
}

/** Najlepsze źródło do zmniejszenia: artwork, potem front (mniejszy plik). */
export function getPokemonMapMarkerResizeSourceUrl(pokemonDetails: PokemonDetails): string {
  return (
    pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ??
    pokemonDetails?.sprites?.front_default ??
    ''
  );
}

export async function getSizedMarkerIconUri(cacheKey: string, sourceUrl: string): Promise<string> {
  if (!sourceUrl) return '';
  const hit = uriCache.get(cacheKey);
  if (hit) return hit;

  const result = await ImageManipulator.manipulateAsync(
    sourceUrl,
    [{ resize: { width: MAX_MARKER_SIDE_PX } }],
    { compress: 0.92, format: ImageManipulator.SaveFormat.PNG },
  );
  uriCache.set(cacheKey, result.uri);
  notifyMarkerIconCache();
  return result.uri;
}
