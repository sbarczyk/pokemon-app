import { Image, StyleSheet, View } from 'react-native';
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

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
    >
      <View style={[styles.markerContainer, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: getPokemonImageUrl(pin.pokemonDetails) }}
          style={styles.pokemonMarkerImage}
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
  },
  pokemonMarkerImage: {
    width: 40,
    height: 40,
  },
});
