import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';

export default function SettingsScreen() {
  const { setTheme, colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={22}
            color={colors.textSecondary}
            style={styles.rowIcon}
          />
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Dark mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            trackColor={{ false: '#ccc', true: '#3B4CCA' }}
            thumbColor="#fff"
          />
        </View>
        <Text style={[styles.rowHint, { color: colors.textSecondary }]}>
          Use dark theme for the app
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  rowHint: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 0,
  },
});
