import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { StatRow } from './StatRow';

const STAT_ROWS: { label: string; statName: string; icon: string; color: string; isMCI?: boolean }[] = [
  { label: 'HP', statName: 'hp', icon: 'heart-outline', color: '#ff4d4d' },
  { label: 'Speed', statName: 'speed', icon: 'flash-outline', color: '#4ade80' },
  { label: 'Attack', statName: 'attack', icon: 'sword-cross', color: '#fbbf24', isMCI: true },
  { label: 'Special Attack', statName: 'special-attack', icon: 'sword-cross', color: '#fbbf24', isMCI: true },
  { label: 'Defense', statName: 'defense', icon: 'shield-outline', color: '#60a5fa' },
  { label: 'Special Defense', statName: 'special-defense', icon: 'shield-outline', color: '#60a5fa' },
];

export const DetailStats = ({ pokemon }: { pokemon: any }) => {
  const { colors } = useTheme();
  const getStat = (name: string) =>
    pokemon.stats.find((s: any) => s.stat.name === name)?.base_stat || 0;

  return (
    <View style={styles.container}>
      {STAT_ROWS.map((row, index) => (
        <React.Fragment key={row.statName}>
          {index > 0 && (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
          <StatRow
            label={row.label}
            value={getStat(row.statName)}
            icon={row.icon}
            color={row.color}
            isMCI={row.isMCI}
          />
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 0 },
  separator: {
    height: 1,
    marginVertical: 4,
    opacity: 0.8,
  },
});
