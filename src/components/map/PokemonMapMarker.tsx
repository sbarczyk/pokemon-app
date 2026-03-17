import { useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Marker } from 'react-native-maps';

import { useTheme } from '../../context/ThemeContext';
import PokemonPin from '../../types/pokemonPin';
import { getPokemonImageUrl } from '../../utils/pokemon';

type PokemonMapMarkerProps = {
  pin: PokemonPin;
  onPress: (pin: PokemonPin) => void;
};

export default function PokemonMapMarker({ pin, onPress }: PokemonMapMarkerProps) {
  const { colors } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
    >
      <View style={[styles.markerContainer, { backgroundColor: colors.card }]}>
        {imageLoading && (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color={colors.text} />
          </View>
        )}
        <Image
          source={{ uri: getPokemonImageUrl(pin.pokemonDetails) }}
          style={styles.pokemonMarkerImage}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: '#3B4CCA',
    elevation: 4,
    position: 'relative',
  },
  loaderWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonMarkerImage: {
    width: 40,
    height: 40,
  },
});
