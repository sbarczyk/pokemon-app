import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';

type CameraStatusMessageProps = {
  message: string;
};

export default function CameraStatusMessage({ message }: CameraStatusMessageProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
});
