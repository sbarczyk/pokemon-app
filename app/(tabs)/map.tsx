import { View, StyleSheet, Alert } from 'react-native';
import { useMemo, useRef, useState, useCallback } from 'react';
import MapView, { LongPressEvent } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';

import FloatingActionButton from '../../src/components/common/FloatingActionButton';
import FetchingPinOverlay from '../../src/components/map/FetchingPinOverlay';
import { normalizeFilePathToUri, saveUriToGallery } from '../../src/services/mediaLibrary';
import MapBottomSheet from '../../src/components/map/MapBottomSheet';
import PokemonMapMarker from '../../src/components/map/PokemonMapMarker';
import { useTheme } from '../../src/context/ThemeContext';
import { usePokemonPins } from '../../src/hooks/usePokemonPins';
import { getPokemonDetailsById } from '../../src/services/pokeapi';
import PokemonPin from '../../src/types/pokemonPin';

const randomPokemonId = () => Math.floor(Math.random() * 1025) + 1;
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
            </MapView>
          </ViewShot>

          <FloatingActionButton label="Zapisz mapę" onPress={handleSaveMap} position="topRight" />

          <MapBottomSheet
            ref={bottomSheetRef}
            selectedPin={selectedPin}
            snapPoints={snapPoints}
            onUnpin={handleUnpin}
          />

          {fetchingPin && <FetchingPinOverlay />}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapCapture: { flex: 1 },
  map: { flex: 1 },
});
