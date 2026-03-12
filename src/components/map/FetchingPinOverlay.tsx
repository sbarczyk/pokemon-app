import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

export default function FetchingPinOverlay() {
  const { colors } = useTheme();

  return (
    <View style={[styles.overlay, { backgroundColor: `${colors.background}E6` }]}>
      <ActivityIndicator size="large" color="#3B4CCA" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
