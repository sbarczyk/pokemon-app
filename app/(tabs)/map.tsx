import { View, StyleSheet, Alert } from 'react-native';
import { useMemo, useRef, useState, useCallback } from 'react';
import MapView, { LongPressEvent } from 'react-native-maps';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ViewShot from 'react-native-view-shot';

import FloatingActionButton from '../../src/components/common/FloatingActionButton';
import FetchingPinOverlay from '../../src/components/map/FetchingPinOverlay';
import MapBottomSheet from '../../src/components/map/MapBottomSheet';
import PhotoDetailSheet from '../../src/components/map/PhotoDetailSheet';
import PokemonMapMarker from '../../src/components/map/PokemonMapMarker';
import SavedPhotoMarker from '../../src/components/map/SavedPhotoMarker';
import { useTheme } from '../../src/context/ThemeContext';
import { usePokemonPins } from '../../src/hooks/usePokemonPins';
import { useSavedPhotos } from '../../src/hooks/useSavedPhotos';
import { normalizeFilePathToUri, saveUriToGallery } from '../../src/services/mediaLibrary';
import { getPokemonDetailsById } from '../../src/services/pokeapi';
import PokemonPin from '../../src/types/pokemonPin';
import type { SavedPhoto } from '../../src/types/savedPhoto';

const randomPokemonId = () => Math.floor(Math.random() * 1025) + 1;

/** Grupuje zdjęcia po tej samej lokalizacji (5 miejsc po przecinku ≈ to samo miejsce). */
function groupPhotosByLocation(photos: SavedPhoto[]): { key: string; latitude: number; longitude: number; photos: SavedPhoto[] }[] {
  const map = new Map<string, SavedPhoto[]>();
  for (const p of photos) {
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
const INITIAL_REGION = {
  latitude: 50.048659,
  longitude: 19.96548,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const { colors } = useTheme();
  const captureRef = useRef<ViewShot>(null);
  const [selectedPin, setSelectedPin] = useState<PokemonPin | null>(null);
  const [fetchingPin, setFetchingPin] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const { pokemonPins, addPin, removePin } = usePokemonPins();
  const { savedPhotos, removePhoto } = useSavedPhotos();
  /** Klucz grupy (lokalizacji) – lista zdjęć w sheetcie zawsze z savedPhotos. */
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null);

  const photoGroups = useMemo(() => groupPhotosByLocation(savedPhotos), [savedPhotos]);
  const selectedPhotosForSheet = useMemo(
    () => photoGroups.find((g) => g.key === selectedLocationKey)?.photos ?? null,
    [photoGroups, selectedLocationKey],
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const photoSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%', '92%'], []);

  const handleLongPress = async (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setFetchingPin(true);
    try {
      const details = await getPokemonDetailsById(randomPokemonId());
      const newPin: PokemonPin = {
        id: Date.now(),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        pokemonDetails: details,
      };
      await addPin(newPin);
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingPin(false);
    }
  };

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
      const wasLastInGroup = (selectedPhotosForSheet?.length ?? 0) <= 1;
      await removePhoto(id, galleryUri);
      if (wasLastInGroup) {
        photoSheetRef.current?.close();
        setSelectedLocationKey(null);
      }
    },
    [removePhoto, selectedPhotosForSheet?.length],
  );

  const handleUnpin = async (id: number) => {
    await removePin(id);
    bottomSheetRef.current?.close();
    setSelectedPin(null);
  };

  const handleSaveMap = async () => {
    try {
      if (!isMapReady) {
        Alert.alert('Mapa się ładuje', 'Poczekaj chwilę, aż mapa w pełni się wyrenderuje.');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, MAP_CAPTURE_DELAY_MS));

      const snapshotUri = await captureRef.current?.capture?.();

      if (!snapshotUri) {
        Alert.alert('Błąd zapisu', 'Nie udało się zapisać mapy.');
        return;
      }

      const saved = await saveUriToGallery(normalizeFilePathToUri(snapshotUri));
      if (!saved) {
        Alert.alert('Brak uprawnień', 'Nadaj dostęp do zdjęć, aby zapisać mapę.');
        return;
      }

      Alert.alert('Zapisano', 'Mapa została zapisana w galerii.');
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Wystąpił problem podczas zapisu mapy.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ViewShot
        ref={captureRef}
        style={styles.mapCapture}
        options={{ format: 'png', quality: 1, result: 'tmpfile' }}
      >
        <MapView
          style={styles.map}
          onLongPress={handleLongPress}
          onMapReady={() => setIsMapReady(true)}
          initialRegion={INITIAL_REGION}
        >
          {pokemonPins.map((pin) => (
            <PokemonMapMarker key={pin.id} pin={pin} onPress={handleMarkerPress} />
          ))}
          {photoGroups.map((group) => (
            <SavedPhotoMarker
              key={group.key}
              photos={group.photos}
              onPress={handlePhotoMarkerPress}
            />
          ))}
        </MapView>
      </ViewShot>

      <FloatingActionButton label="Zapisz mapę" onPress={handleSaveMap} position="topRight" />

      <MapBottomSheet
        ref={bottomSheetRef}
        selectedPin={selectedPin}
        snapPoints={snapPoints}
        onUnpin={handleUnpin}
      />

      <PhotoDetailSheet
        ref={photoSheetRef}
        photos={selectedPhotosForSheet}
        onRemove={handleRemovePhoto}
        snapPoints={snapPoints}
      />

      {fetchingPin && <FetchingPinOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapCapture: { flex: 1 },
  map: { flex: 1 },
});
