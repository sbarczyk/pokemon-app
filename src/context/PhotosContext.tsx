import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { getSavedPhotosFromStorage, saveSavedPhotosToStorage, getCachedSavedPhotos } from '../services/savedPhotos';
import { deletePhotoFromGallery } from '../services/mediaLibrary';
import type { SavedPhoto } from '../types/savedPhoto';

interface PhotosContextType {
  savedPhotos: SavedPhoto[];
  addPhoto: (photo: SavedPhoto) => void;
  updatePhoto: (id: number, updates: Partial<SavedPhoto>) => void;
  removePhoto: (id: number, galleryUri?: string) => Promise<void>;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

export const PhotosProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>(() => getCachedSavedPhotos() ?? []);

  useEffect(() => {
    getSavedPhotosFromStorage().then(setSavedPhotos);
  }, []);

  const addPhoto = useCallback((photo: SavedPhoto) => {
    setSavedPhotos((prev) => {
      const updated = [photo, ...prev];
      saveSavedPhotosToStorage(updated);
      return updated;
    });
  }, []);

  const updatePhoto = useCallback((id: number, updates: Partial<SavedPhoto>) => {
    setSavedPhotos((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveSavedPhotosToStorage(updated);
      return updated;
    });
  }, []);

  const removePhoto = useCallback(async (id: number, galleryUri?: string) => {
    if (galleryUri) await deletePhotoFromGallery(galleryUri).catch(console.error);
    setSavedPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveSavedPhotosToStorage(updated);
      return updated;
    });
  }, []);

  return (
    <PhotosContext.Provider value={{ savedPhotos, addPhoto, updatePhoto, removePhoto }}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) throw new Error('usePhotos must be used within PhotosProvider');
  return context;
};