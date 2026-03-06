import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatRow } from './StatRow';

export const DetailStats = ({ pokemon }: { pokemon: any }) => {
  const getStat = (name: string) => pokemon.stats.find((s: any) => s.stat.name === name)?.base_stat || 0;

  return (
    <View style={styles.container}>
      <StatRow label="HP" value={getStat("hp")} icon="heart-outline" color="#ff4d4d" />
      <StatRow label="Speed" value={getStat("speed")} icon="flash-outline" color="#4ade80" />
      <View style={styles.line} />
      <StatRow label="Attack" value={getStat("attack")} icon="sword-cross" color="#fbbf24" isMCI />
      <StatRow label="Special Attack" value={getStat("special-attack")} icon="sword-cross" color="#fbbf24" isMCI />
      <View style={styles.line} />
      <StatRow label="Defense" value={getStat("defense")} icon="shield-outline" color="#60a5fa" />
      <StatRow label="Special Defense" value={getStat("special-defense")} icon="shield-outline" color="#60a5fa" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  line: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 5 }
});