import { memo, useCallback, useEffect, useState, type RefObject } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';
import ViewShot from 'react-native-view-shot';

import FetchingPinOverlay from './FetchingPinOverlay';
import PokemonMapMarker from './PokemonMapMarker';
import SavedPhotoMarker from './SavedPhotoMarker';
import { useTheme } from '../../context/ThemeContext';
import { usePokemonPins } from '../../hooks/usePokemonPins';
import { getPokemonDetailsById } from '../../services/pokeapi';
import PokemonPin from '../../types/pokemonPin';
import type { SavedPhoto } from '../../types/savedPhoto';
import AnimatedCounterView from '../../../modules/animated-counter/src/AnimatedCounterView';

const randomPokemonId = () => Math.floor(Math.random() * 1025) + 1;

const INITIAL_REGION = {
  latitude: 50.048659,
  longitude: 19.96548,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export type PhotoLocationGroup = {
  key: string;
  latitude: number;
  longitude: number;
  photos: SavedPhoto[];
};

type PokemonMapViewProps = {
  captureRef: RefObject<ViewShot | null>;
  onMapReady: () => void;
  onExposeRemovePin: (removePin: (id: number) => void) => void;
  onPokemonMarkerPress: (pin: PokemonPin) => void;
  photoGroups: PhotoLocationGroup[];
  onSavedPhotoMarkerPress: (photos: SavedPhoto[]) => void;
};

function PokemonMapView({
  captureRef,
  onMapReady,
  onExposeRemovePin,
  onPokemonMarkerPress,
  photoGroups,
  onSavedPhotoMarkerPress,
}: PokemonMapViewProps) {
  const { colors } = useTheme();
  const { pokemonPins, addPin, removePin } = usePokemonPins();
  const [fetchingPin, setFetchingPin] = useState(false);

  useEffect(() => {
    onExposeRemovePin(removePin);
  }, [onExposeRemovePin, removePin]);

  const handleLongPress = useCallback(
    async (event: LongPressEvent) => {
      const { coordinate } = event.nativeEvent;
      setFetchingPin(true);
      try {
        const details = await getPokemonDetailsById(randomPokemonId());
        addPin({
          id: Date.now(),
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          pokemonDetails: details,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingPin(false);
      }
    },
    [addPin],
  );

  const markerCount = pokemonPins.length + photoGroups.length;

  return (
    <View style={styles.root}>
      <ViewShot
        ref={captureRef}
        style={styles.mapCapture}
        options={{ format: 'png', quality: 1, result: 'tmpfile' }}
      >
        <MapView
          style={styles.map}
          onLongPress={handleLongPress}
          onMapReady={onMapReady}
          initialRegion={INITIAL_REGION}
        >
          {pokemonPins.map((pin) => (
            <PokemonMapMarker key={pin.id} pin={pin} onPress={onPokemonMarkerPress} />
          ))}
          {photoGroups.map((group) => (
            <SavedPhotoMarker
              key={group.key}
              photos={group.photos}
              onPress={onSavedPhotoMarkerPress}
            />
          ))}
        </MapView>
      </ViewShot>

      <View style={[styles.counterContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.counterText, { color: colors.text }]}>Aktualna liczba pinów: </Text>
        <AnimatedCounterView count={markerCount} style={styles.counterValue} />
      </View>

      {fetchingPin && <FetchingPinOverlay />}
    </View>
  );
}

function propsAreEqual(prev: PokemonMapViewProps, next: PokemonMapViewProps) {
  return (
    prev.captureRef === next.captureRef &&
    prev.onMapReady === next.onMapReady &&
    prev.onExposeRemovePin === next.onExposeRemovePin &&
    prev.onPokemonMarkerPress === next.onPokemonMarkerPress &&
    prev.onSavedPhotoMarkerPress === next.onSavedPhotoMarkerPress &&
    prev.photoGroups === next.photoGroups
  );
}

export default memo(PokemonMapView, propsAreEqual);

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapCapture: { flex: 1 },
  map: { flex: 1 },
  counterContainer: {
    position: 'absolute',
    top: 53,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 1000,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  counterValue: {
    minWidth: 40,
    width: 36,
    height: 24,
  },
});
