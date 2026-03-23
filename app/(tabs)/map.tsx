import { View, StyleSheet, Alert } from 'react-native';
import { useMemo, useRef, useState, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ViewShot from 'react-native-view-shot';

import FloatingActionButton from '../../src/components/common/FloatingActionButton';
import MapBottomSheet from '../../src/components/map/MapBottomSheet';
import PhotoDetailSheet from '../../src/components/map/PhotoDetailSheet';
import PokemonMapView from '../../src/components/map/PokemonMapView';
import { useTheme } from '../../src/context/ThemeContext';
import { usePhotos } from '../../src/context/PhotosContext';
import { normalizeFilePathToUri, saveUriToGallery } from '../../src/services/mediaLibrary';
import PokemonPin from '../../src/types/pokemonPin';
import type { SavedPhoto } from '../../src/types/savedPhoto';

function groupPhotosByLocation(photos: SavedPhoto[]): { key: string; latitude: number; longitude: number; photos: SavedPhoto[] }[] {
  const map = new Map<string, SavedPhoto[]>();

  const validPhotos = photos.filter((p) => p.latitude !== 0 && p.longitude !== 0);

  for (const p of validPhotos) {
    const key = `${p.latitude.toFixed(5)},${p.longitude.toFixed(5)}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).map(([key, list]) => ({
    key,
    latitude: list[0].latitude,
    longitude: list[0].longitude,
    photos: list,
  }));
}

const MAP_CAPTURE_DELAY_MS = 400;

export default function MapScreen() {
  const { colors } = useTheme();
  const captureRef = useRef<ViewShot>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const photoSheetRef = useRef<BottomSheetModal>(null);
  const removePinRef = useRef<(id: number) => void>(() => {});

  const { savedPhotos, removePhoto } = usePhotos();

  const [selectedPin, setSelectedPin] = useState<PokemonPin | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null);

  const onExposeRemovePin = useCallback((removePin: (id: number) => void) => {
    removePinRef.current = removePin;
  }, []);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const snapPoints = useMemo(() => ['62%', '90%'], []);

  const photoGroups = useMemo(() => groupPhotosByLocation(savedPhotos), [savedPhotos]);

  const selectedPhotosForSheet = useMemo(
    () => photoGroups.find((g) => g.key === selectedLocationKey)?.photos ?? null,
    [photoGroups, selectedLocationKey],
  );

  const handleMarkerPress = useCallback((pin: PokemonPin) => {
    setSelectedPin(pin);
    bottomSheetRef.current?.present();
  }, []);

  const handlePhotoMarkerPress = useCallback((photos: SavedPhoto[]) => {
    const key = `${photos[0].latitude.toFixed(5)},${photos[0].longitude.toFixed(5)}`;
    setSelectedLocationKey(key);
    photoSheetRef.current?.present();
  }, []);

  const handleRemovePhoto = useCallback(
    async (id: number, galleryUri?: string) => {
      const remainingInGroup = selectedPhotosForSheet?.length ?? 0;

      await removePhoto(id, galleryUri);

      if (remainingInGroup <= 1) {
        photoSheetRef.current?.dismiss();
        setSelectedLocationKey(null);
      }
    },
    [removePhoto, selectedPhotosForSheet],
  );

  const handleUnpin = (id: number) => {
    removePinRef.current(id);
    bottomSheetRef.current?.close();
  };

  const handleSheetDismiss = useCallback(() => {
    setSelectedPin(null);
  }, []);

  const handleSaveMap = async () => {
    try {
      if (!isMapReady) {
        Alert.alert('Map is loading', 'Please wait a moment...');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, MAP_CAPTURE_DELAY_MS));
      const snapshotUri = await captureRef.current?.capture?.();

      if (!snapshotUri) throw new Error('Capture failed');

      const saved = await saveUriToGallery(normalizeFilePathToUri(snapshotUri));
      if (!saved) {
        Alert.alert('Permission denied', 'Grant photo access in settings.');
        return;
      }
      Alert.alert('Saved', 'Map has been saved to gallery.');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the map.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PokemonMapView
        captureRef={captureRef}
        onMapReady={handleMapReady}
        onExposeRemovePin={onExposeRemovePin}
        onPokemonMarkerPress={handleMarkerPress}
        photoGroups={photoGroups}
        onSavedPhotoMarkerPress={handlePhotoMarkerPress}
      />

      <FloatingActionButton label="Save map" onPress={handleSaveMap} position="topRight" />

      <MapBottomSheet
        ref={bottomSheetRef}
        selectedPin={selectedPin}
        snapPoints={snapPoints}
        onUnpin={handleUnpin}
        onDismiss={handleSheetDismiss}
      />

      <PhotoDetailSheet
        ref={photoSheetRef}
        photos={selectedPhotosForSheet}
        onRemove={handleRemovePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
