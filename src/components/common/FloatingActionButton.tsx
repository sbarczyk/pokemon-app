import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

type FloatingActionButtonProps = {
  label: string;
  onPress: () => void;
  position: 'bottomCenter' | 'topRight';
};

export default function FloatingActionButton({
  label,
  onPress,
  position,
}: FloatingActionButtonProps) {
  const positionStyle =
    position === 'bottomCenter' ? styles.bottomCenter : styles.topRight;

  return (
    <TouchableOpacity
      style={[styles.button, positionStyle]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: '#3B4CCA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomCenter: {
    bottom: 30,
    alignSelf: 'center',
  } as ViewStyle,
  topRight: {
    top: 55,
    right: 16,
  } as ViewStyle,
});
