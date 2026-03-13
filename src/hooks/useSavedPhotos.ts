import { useCallback, useEffect, useState } from 'react';

import { deletePhotoFromGallery } from '../services/mediaLibrary';
import {
  getCachedSavedPhotos,
  getSavedPhotosFromStorage,
  saveSavedPhotosToStorage,
} from '../services/savedPhotos';
import type { SavedPhoto } from '../types/savedPhoto';

export function useSavedPhotos() {
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>(
    () => getCachedSavedPhotos() ?? [],
  );

  useEffect(() => {
    getSavedPhotosFromStorage().then(setSavedPhotos);
  }, []);

  const addPhoto = useCallback(
    async (photo: SavedPhoto) => {
      const updated = [...savedPhotos, photo];
      setSavedPhotos(updated);
      await saveSavedPhotosToStorage(updated);
    },
    [savedPhotos],
  );

  const removePhoto = useCallback(async (id: number, galleryUri?: string): Promise<void> => {
    if (galleryUri) {
      try {
        await deletePhotoFromGallery(galleryUri);
      } catch (e) {
        console.error('removePhoto: delete from gallery failed', e);
      }
    }
    return new Promise((resolve, reject) => {
      setSavedPhotos((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveSavedPhotosToStorage(updated).then(resolve).catch((e) => {
          console.error('removePhoto persist', e);
          reject(e);
        });
        return updated;
      });
    });
  }, []);

  return { savedPhotos, addPhoto, removePhoto };
}
