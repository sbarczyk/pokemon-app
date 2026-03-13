import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DetailHeader } from './DetailHeader';
import { DetailStats } from './DetailsStats';
import { useTheme } from '../../context/ThemeContext';
import type { PokemonDetails } from '../../types/pokemon';

const STATS_BG_LIGHT = '#f0f0f0';
const STATS_BG_DARK = '#282828';

type Props = {
  pokemon: PokemonDetails;
  imageUri: string;
  actionButton: React.ReactNode;
};

export function PokemonDetailContent({ pokemon, imageUri, actionButton }: Props) {
  const { isDark } = useTheme();
  const statsBg = isDark ? STATS_BG_DARK : STATS_BG_LIGHT;

  return (
    <>
      <Image source={{ uri: imageUri }} style={styles.pokemonImage} />
      <DetailHeader name={pokemon.name} types={pokemon.types} />
      <View style={styles.actionWrapper}>{actionButton}</View>
      <View style={[styles.statsWrapper, { backgroundColor: statsBg }]}>
        <DetailStats pokemon={pokemon} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pokemonImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 15
  },
  actionWrapper: { marginTop: 0, marginBottom: 10 },
  statsWrapper: {
    borderRadius: 16,
    padding: 16,
    marginTop: 0,
  },
});
