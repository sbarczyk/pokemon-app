import { useEffect, useRef } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Face } from 'react-native-vision-camera-face-detector';

import { calculatePokemonPosition } from '../../utils/coordinateHelper';

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 220,
  mass: 0.4,
};

const SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

type Props = {
  face: Face;
};

export function PokemonSprite({ face }: Props) {
  const leftSV = useSharedValue(0);
  const topSV = useSharedValue(0);
  const sizeSV = useSharedValue(0);
  const rotationSV = useSharedValue(0);
  const isFirstRender = useRef(true);

  const { left, top, width, rotateDeg } = calculatePokemonPosition(face);

  useEffect(() => {
    if (isFirstRender.current) {
      leftSV.value = left;
      topSV.value = top;
      sizeSV.value = width;
      rotationSV.value = rotateDeg;
      isFirstRender.current = false;
    } else {
      leftSV.value = withSpring(left, SPRING_CONFIG);
      topSV.value = withSpring(top, SPRING_CONFIG);
      sizeSV.value = withSpring(width, SPRING_CONFIG);
      rotationSV.value = withSpring(rotateDeg, SPRING_CONFIG);
    }
  }, [left, top, width, rotateDeg]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: leftSV.value,
    top: topSV.value,
    width: sizeSV.value,
    height: sizeSV.value,
    transform: [{ rotate: `${rotationSV.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={{ uri: SPRITE_URL }} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
