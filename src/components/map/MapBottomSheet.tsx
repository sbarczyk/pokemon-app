import React, { forwardRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import PokemonPin from '../../types/pokemonPin';
import { getPokemonImageUrl } from '../../utils/pokemon';
import { useTheme } from '../../context/ThemeContext';
import { DetailHeader } from '../details/DetailHeader';
import { DetailStats } from '../details/DetailsStats';

interface Props {
  selectedPin: PokemonPin | null;
  snapPoints: string[];
  onUnpin: (id: number) => void;
}

const MapBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ selectedPin, snapPoints, onUnpin }, ref) => {
    const { colors } = useTheme();
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={[styles.modalBackground, { backgroundColor: colors.card }]}
      >
        <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
          {selectedPin && (
            <>
              <Image
                source={{ uri: getPokemonImageUrl(selectedPin.pokemonDetails) }}
                style={styles.pokemonModalImage}
              />

              <DetailHeader
                name={selectedPin.pokemonDetails.name}
                types={selectedPin.pokemonDetails.types}
              />

              <TouchableOpacity
                style={[
                  styles.unpinButton,
                  {
                    backgroundColor: colors.border,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => onUnpin(selectedPin.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.unpinIconWrapper, { backgroundColor: colors.card }]}>
                  <Ionicons name="location-outline" size={18} color="#E53935" />
                </View>
                <Text style={styles.unpinPokemonButtonText}>Release Pokémon</Text>
              </TouchableOpacity>

              <View style={[styles.statsWrapper, { backgroundColor: colors.border }]}>
                <DetailStats pokemon={selectedPin.pokemonDetails} />
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

MapBottomSheet.displayName = 'MapBottomSheet';

export default MapBottomSheet;

const styles = StyleSheet.create({
  modalBackground: {
    borderRadius: 24,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pokemonModalImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  statsWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  unpinButton: {
    marginTop: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  unpinIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  unpinPokemonButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '600',
  },
});