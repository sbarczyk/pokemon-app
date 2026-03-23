import { memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { useTheme } from '../../context/ThemeContext';
import PokemonPin from '../../types/pokemonPin';
import {
  getCachedSizedMarkerUri,
  getMarkerIconCacheSnapshot,
  getSizedMarkerIconUri,
  getPokemonMapMarkerResizeSourceUrl,
  subscribeMarkerIconCache,
} from '../../utils/androidMarkerIcon';
import { getPokemonMapMarkerImageUrl, getPokemonMapMarkerNativeImageUrl } from '../../utils/pokemon';

type PokemonMapMarkerProps = {
  pin: PokemonPin;
  onPress: (pin: PokemonPin) => void;
};


function PokemonMapMarker({ pin, onPress }: PokemonMapMarkerProps) {
  const { colors } = useTheme();
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const [androidPendingUri, setAndroidPendingUri] = useState<string | null>(null);
  const imageUrl = getPokemonMapMarkerImageUrl(pin.pokemonDetails);
  const androidNativeUrl = getPokemonMapMarkerNativeImageUrl(pin.pokemonDetails);
  const androidResizeSource = getPokemonMapMarkerResizeSourceUrl(pin.pokemonDetails);
  const isAndroid = Platform.OS === 'android';

  const androidCacheKey = useMemo(
    () =>
      isAndroid && androidResizeSource
        ? `p${pin.pokemonDetails.id}-${androidResizeSource}`
        : '',
    [isAndroid, pin.pokemonDetails.id, androidResizeSource],
  );

  const markerIconCacheRev = useSyncExternalStore(
    subscribeMarkerIconCache,
    getMarkerIconCacheSnapshot,
    getMarkerIconCacheSnapshot,
  );

  const androidDisplayUri = useMemo(() => {
    if (!androidCacheKey) return null;
    return getCachedSizedMarkerUri(androidCacheKey) ?? androidPendingUri;
  }, [androidCacheKey, androidPendingUri, markerIconCacheRev]);

  const handleImageLoaded = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  const handleImageError = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  useEffect(() => {
    if (!androidCacheKey || !androidResizeSource) {
      setAndroidPendingUri(null);
      return;
    }
    if (getCachedSizedMarkerUri(androidCacheKey)) {
      setAndroidPendingUri(null);
      return;
    }
    setAndroidPendingUri(null);
    let cancelled = false;
    getSizedMarkerIconUri(androidCacheKey, androidResizeSource)
      .then((uri) => {
        if (!cancelled && uri) setAndroidPendingUri(uri);
      })
      .catch(() => {
        if (!cancelled) {
          setAndroidPendingUri(androidNativeUrl || androidResizeSource);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [androidCacheKey, androidResizeSource, androidNativeUrl]);

  if (isAndroid) {
    if (androidResizeSource) {
      if (!androidDisplayUri) {
        return null;
      }
      return (
        <Marker
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          onPress={() => onPress(pin)}
          image={{ uri: androidDisplayUri }}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      );
    }
    return (
      <Marker
        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
        onPress={() => onPress(pin)}
        pinColor="#3B4CCA"
      />
    );
  }

  if (!imageUrl) {
    return (
      <Marker
        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
        onPress={() => onPress(pin)}
        pinColor="#3B4CCA"
      />
    );
  }

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
      tracksViewChanges={tracksViewChanges}
    >
      <View collapsable={false} style={[styles.markerContainer, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.pokemonMarkerImage}
          resizeMode="contain"
          onLoad={handleImageLoaded}
          onError={handleImageError}
        />
      </View>
    </Marker>
  );
}

function propsEqual(prev: PokemonMapMarkerProps, next: PokemonMapMarkerProps) {
  const prevUrl = getPokemonMapMarkerImageUrl(prev.pin.pokemonDetails);
  const nextUrl = getPokemonMapMarkerImageUrl(next.pin.pokemonDetails);
  const prevNative = getPokemonMapMarkerNativeImageUrl(prev.pin.pokemonDetails);
  const nextNative = getPokemonMapMarkerNativeImageUrl(next.pin.pokemonDetails);
  const prevResize = getPokemonMapMarkerResizeSourceUrl(prev.pin.pokemonDetails);
  const nextResize = getPokemonMapMarkerResizeSourceUrl(next.pin.pokemonDetails);
  return (
    prev.onPress === next.onPress &&
    prev.pin.id === next.pin.id &&
    prev.pin.latitude === next.pin.latitude &&
    prev.pin.longitude === next.pin.longitude &&
    prev.pin.pokemonDetails.id === next.pin.pokemonDetails.id &&
    prevUrl === nextUrl &&
    prevNative === nextNative &&
    prevResize === nextResize
  );
}

export default memo(PokemonMapMarker, propsEqual);

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: '#3B4CCA',
    elevation: 4,
    overflow: 'hidden',
  },
  pokemonMarkerImage: {
    width: 40,
    height: 40,
  },
});
