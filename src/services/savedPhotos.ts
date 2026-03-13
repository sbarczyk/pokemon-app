import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedPhoto } from '../types/savedPhoto';

const STORAGE_KEY = 'saved_camera_photos';

let cached: SavedPhoto[] | null = null;

/** Synchroniczny podgląd cache – do szybkiego initial state (po preload). */
export function getCachedSavedPhotos(): SavedPhoto[] | null {
  return cached;
}

/** Odświeża cache i zwraca listę. Wywołaj przy starcie (preload), żeby markery na mapie pojawiły się od razu. */
export async function getSavedPhotosFromStorage(): Promise<SavedPhoto[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const list = data ? JSON.parse(data) : [];
    cached = list;
    return list;
  } catch (error) {
    console.error('Error reading saved photos:', error);
    cached = [];
    return [];
  }
}

export async function saveSavedPhotosToStorage(photos: SavedPhoto[]): Promise<void> {
  try {
    cached = photos;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Error saving saved photos:', error);
  }
}
