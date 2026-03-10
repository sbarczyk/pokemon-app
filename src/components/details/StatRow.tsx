import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export function StatRow({ label, value, icon, color, isMCI = false }: any) {
  const { colors } = useTheme();
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.valueGroup}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        {isMCI ? (
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        ) : (
          <Ionicons name={icon} size={20} color={color} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statLabel: { fontSize: 16, fontWeight: '600' },
  valueGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statValue: { fontSize: 16, fontWeight: '800' },
});
