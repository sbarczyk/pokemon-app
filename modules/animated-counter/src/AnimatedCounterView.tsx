import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { Platform, View, Text, StyleSheet, ViewProps } from 'react-native';

export interface AnimatedCounterProps extends ViewProps {
  count: number;
}

const NativeView: React.ComponentType<AnimatedCounterProps> | null =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? requireNativeViewManager('AnimatedCounter')
    : null;

export default function AnimatedCounterView({ count, style, ...props }: AnimatedCounterProps) {
  if ((Platform.OS === 'ios' || Platform.OS === 'android') && NativeView) {
    return (
      <NativeView
        {...props}
        count={count}
        style={[styles.baseSize, style]}
      />
    );
  }

  return (
    <View style={[styles.baseSize, styles.fallbackContainer, style]} {...props}>
      <Text style={styles.fallbackText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baseSize: {
    width: 100,
    height: 60,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});