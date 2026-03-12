import { StyleSheet, View } from 'react-native';
import { Face } from 'react-native-vision-camera-face-detector';
import { FrameDimensions } from '../../types/camera';
import { PokemonSprite } from './PokemonSprite';

type FaceOverlayProps = {
  faces: Face[];
  frameDimensions: FrameDimensions | null;
};

function FaceBox({ face }: { face: Face }) {
  const { x, y, width, height } = face.bounds;
  const left = x;
  return (
    <View
      style={[
        styles.faceBox,
        { left, top: y, width, height },
      ]}
    />
  );
}

export function FaceOverlay({ faces, frameDimensions }: FaceOverlayProps) {
  if (!frameDimensions || faces.length === 0) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none">
      {faces.map((face, index) => (
        <FaceBox key={`box-${index}`} face={face} />
      ))}
      {faces.map((face, index) => (
        <PokemonSprite key={`sprite-${index}`} face={face} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 128, 0.9)',
    borderRadius: 4,
  },
});
