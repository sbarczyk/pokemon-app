import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pokemonTypeColors } from '../../theme/pokemonTypes';

export const DetailHeader = ({ name, types }: { name: string; types: any[] }) => (
  <View style={styles.container}>
    <Text style={styles.pokemonName}>{name}</Text>
    <View style={styles.typesRow}>
      {types.map((t) => (
        <View key={t.type.name} style={styles.typeBadge}>
          <View style={[styles.typeDot, { backgroundColor: pokemonTypeColors[t.type.name] || "#777" }]} />
          <Text style={styles.typeText}>{t.type.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  pokemonName: { fontSize: 32, fontWeight: "800", textTransform: "capitalize", marginBottom: 10 },
  typesRow: { flexDirection: "row", gap: 10 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  typeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  typeText: { fontSize: 14, fontWeight: "600", color: "#333", textTransform: "capitalize" },
});