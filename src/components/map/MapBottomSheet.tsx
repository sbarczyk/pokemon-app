import React, { forwardRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import PokemonPin from '../../types/pokemonPin';
import { getPokemonImageUrl } from '../../utils/pokemon';
import { useTheme } from '../../context/ThemeContext';
import DetailsModal from '../details/DetailsModal';

interface Props {
  selectedPin: PokemonPin | null;
  snapPoints: string[];
  onUnpin: (id: number) => void;
}

const MapBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ selectedPin, snapPoints, onUnpin }, ref) => {
    const { colors } = useTheme();

    const actionButton = selectedPin ? (
      <TouchableOpacity
        style={[
          styles.unpinButton,
          { backgroundColor: colors.border, borderColor: colors.border },
        ]}
        onPress={() => onUnpin(selectedPin.id)}
        activeOpacity={0.85}
      >
        <View style={[styles.unpinIconWrapper, { backgroundColor: colors.card }]}>
          <Ionicons name="location-outline" size={18} color="#E53935" />
        </View>
        <Text style={styles.unpinPokemonButtonText}>Release Pokémon</Text>
      </TouchableOpacity>
    ) : null;

    return (
      <DetailsModal
        ref={ref}
        pokemon={selectedPin?.pokemonDetails ?? null}
        imageUri={selectedPin ? getPokemonImageUrl(selectedPin.pokemonDetails) : ''}
        actionButton={actionButton}
        snapPoints={snapPoints}
      />
    );
  }
);

MapBottomSheet.displayName = 'MapBottomSheet';

export default MapBottomSheet;

const styles = StyleSheet.create({
  unpinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    outlineWidth: 2,
    outlineColor: '#E53935',
    outlineStyle: 'solid',
    marginBottom: 35,
    marginTop: 10,
  },
  unpinIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unpinPokemonButtonText: {
    color: '#E53935',
    fontSize: 17,
    fontWeight: '600',
  },
});
