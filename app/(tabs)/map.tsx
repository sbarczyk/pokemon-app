import { View, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PokemonPin from '../../src/types/pokemonPin';
import { savePokemonPinsToStorage, getPokemonPinsFromStorage } from '../../src/services/pinPokemon';
import { getPokemonDetailsById } from '../../src/services/pokeapi';
import { getPokemonImageUrl } from '../../src/utils/pokemon';

import MapBottomSheet from '../../src/components/map/MapBottomSheet';

const randomPokemonId = () => Math.floor(Math.random() * 1025) + 1;

export default function MapScreen() {
  const [pokemonPins, setPokemonPins] = useState<PokemonPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<PokemonPin | null>(null);
  const [fetchingPin, setFetchingPin] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '80%'], []);

  useEffect(() => {
    AsyncStorage.clear();
    getPokemonPinsFromStorage().then(setPokemonPins);
  }, []);

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
      const updatedPins = [...pokemonPins, newPin];
      setPokemonPins(updatedPins);
      await savePokemonPinsToStorage(updatedPins);
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
    const updatedPins = pokemonPins.filter((p) => p.id !== id);
    setPokemonPins(updatedPins);
    await savePokemonPinsToStorage(updatedPins);
    bottomSheetRef.current?.close();
    setSelectedPin(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            onLongPress={handleLongPress}
            initialRegion={{
              latitude: 50.048659,
              longitude: 19.965480,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {pokemonPins.map((pin) => (
              <Marker
                key={pin.id}
                coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                onPress={() => handleMarkerPress(pin)}
              >
                <View style={styles.markerContainer}>
                  <Image 
                    source={{ uri: getPokemonImageUrl(pin.pokemonDetails) }} 
                    style={styles.pokemonMarkerImage} 
                  />
                </View>
              </Marker>
            ))}
          </MapView>

          <MapBottomSheet 
            ref={bottomSheetRef} 
            selectedPin={selectedPin} 
            snapPoints={snapPoints}
            onUnpin={handleUnpin}
          />

          {fetchingPin && (
            <View style={styles.fetchingOverlay}>
              <ActivityIndicator size="large" color="#3B4CCA" />
            </View>
          )}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  fetchingOverlay: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: '#3B4CCA',
    elevation: 4,
  },
  pokemonMarkerImage: {
    width: 40,
    height: 40,
  },
});