import { View, Text, StyleSheet } from 'react-native';

export default function FaceDetectedBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wykryto twarz!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  text: {
    color: '#FFFFFF',
  },
});
