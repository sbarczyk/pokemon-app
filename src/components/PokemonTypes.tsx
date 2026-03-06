import { View, Text, StyleSheet } from 'react-native';
import { PokemonTypesProps } from '../types/pokemon';
import { pokemonTypeColors } from '../theme/pokemonTypes';

export default function PokemonTypes({ types }: PokemonTypesProps) {
  return (
    <View style={styles.typesContainer}>
      {types.map((t) => {
        const backgroundColor = pokemonTypeColors[t.type.name] || '#999';

        return (
          <View
            key={t.type.name}
            style={[styles.typeBadge, { backgroundColor }]}
          >
            <Text style={styles.typeText}>{t.type.name}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  typeBadge: {
    borderRadius: 6,
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
});
