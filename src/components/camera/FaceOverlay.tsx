import React, { useRef } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Face } from 'react-native-vision-camera-face-detector';

import { FrameDimensions, OverlayPosition } from '../../types/camera';
import { calculatePokemonPosition } from '../../utils/coordinateHelper';
import { smoothOverlayPosition } from '../../utils/positionSmoothing';

type FaceOverlayProps = {
  faces: Face[];
  frameDimensions: FrameDimensions | null;
};

const PIKACHU_SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

export const FaceOverlay = ({ faces, frameDimensions }: FaceOverlayProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const previousPositionsRef = useRef<Record<number, OverlayPosition>>({});

  if (!frameDimensions) {
    return null;
  }

  if (faces.length === 0) {
    previousPositionsRef.current = {};
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {faces.map((face, index) => {
        const rawPosition = calculatePokemonPosition(
          face,
          screenWidth,
          screenHeight,
          frameDimensions.width,
          frameDimensions.height,
        );

        const previous = previousPositionsRef.current[index];
        const smoothedPosition = smoothOverlayPosition(rawPosition, previous);
        previousPositionsRef.current[index] = smoothedPosition;

        return (
          <View key={index} style={[styles.pokemonContainer, smoothedPosition]}>
            <Image source={{ uri: PIKACHU_SPRITE_URL }} style={styles.image} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pokemonContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});