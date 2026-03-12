import { Face } from 'react-native-vision-camera-face-detector';

import { useLayoutConstants } from '../constants/layout';
import { OverlayPosition } from '../types/camera';

const MIN_SIZE = 56;
const MAX_SIZE_RATIO = 0.28;
const SIZE_DIVISOR = 1.35;
const FOREHEAD_LEVEL = 0.18;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calculatePokemonPosition = (face: Face): OverlayPosition => {
  const { x, y, width: faceW, height: faceH } = face.bounds;

  const maxSize = Math.min(useLayoutConstants().SCREEN_WIDTH, useLayoutConstants().SCREEN_HEIGHT) * MAX_SIZE_RATIO;
  const size = clamp(faceW / SIZE_DIVISOR, MIN_SIZE, maxSize);

  const faceCenterX = x + faceW / 2;
  const left = clamp(faceCenterX - size / 2, 0, useLayoutConstants().SCREEN_WIDTH - size);

  const foreheadY = y + faceH * FOREHEAD_LEVEL;
  const top = clamp(foreheadY - size / 2, 0, useLayoutConstants().SCREEN_HEIGHT - size);

  return {
    width: size,
    height: size,
    left,
    top,
    rotateDeg: face.rollAngle,
  };
};
