import { memo, useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { useTheme } from '../../context/ThemeContext';
import PokemonPin from '../../types/pokemonPin';
import { getPokemonImageUrl } from '../../utils/pokemon';

type PokemonMapMarkerProps = {
  pin: PokemonPin;
  onPress: (pin: PokemonPin) => void;
};

function PokemonMapMarker({ pin, onPress }: PokemonMapMarkerProps) {
  const { colors } = useTheme();
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const imageUrl = getPokemonImageUrl(pin.pokemonDetails);

  const handleImageLoaded = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
      tracksViewChanges={tracksViewChanges}
    >
      <View style={[styles.markerContainer, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.pokemonMarkerImage}
          resizeMode="contain"
          onLoad={handleImageLoaded}
          onLoadEnd={handleImageLoaded}
          onError={handleImageLoaded}
        />
      </View>
    </Marker>
  );
}

function propsEqual(prev: PokemonMapMarkerProps, next: PokemonMapMarkerProps) {
  return (
    prev.onPress === next.onPress &&
    prev.pin.id === next.pin.id &&
    prev.pin.latitude === next.pin.latitude &&
    prev.pin.longitude === next.pin.longitude &&
    prev.pin.pokemonDetails.id === next.pin.pokemonDetails.id
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
  },
  pokemonMarkerImage: {
    width: 40,
    height: 40,
  },
});
