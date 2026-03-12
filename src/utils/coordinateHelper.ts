import { Face } from 'react-native-vision-camera-face-detector';

import { OverlayPosition } from '../types/camera';

type FaceBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MIN_POKEMON_SIZE = 56;
const MAX_POKEMON_SIZE_RATIO = 0.28;
const POKEMON_SIZE_DIVISOR = 1.25;
const FOREHEAD_Y_OFFSET = 0.8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const rotateFaceBoundsToPortrait = (
  bounds: FaceBounds,
  frameWidth: number,
  frameHeight: number,
  screenWidth: number,
  screenHeight: number,
) => {
  const needsRotation = frameWidth > frameHeight && screenHeight > screenWidth;

  if (!needsRotation) {
    return {
      bounds,
      frame: { width: frameWidth, height: frameHeight },
    };
  }

  return {
    bounds: {
      x: bounds.y,
      y: frameWidth - (bounds.x + bounds.width),
      width: bounds.height,
      height: bounds.width,
    },
    frame: { width: frameHeight, height: frameWidth },
  };
};

export const calculatePokemonPosition = (
  face: Face,
  screenWidth: number,
  screenHeight: number,
  frameWidth: number,
  frameHeight: number,
): OverlayPosition => {
  const { bounds, frame } = rotateFaceBoundsToPortrait(
    face.bounds,
    frameWidth,
    frameHeight,
    screenWidth,
    screenHeight,
  );
  const scale = Math.max(
    screenWidth / frame.width,
    screenHeight / frame.height,
  );
  const offsetX = (screenWidth - frame.width * scale) / 2;
  const offsetY = (screenHeight - frame.height * scale) / 2;

  const faceX = bounds.x * scale + offsetX;
  const faceY = bounds.y * scale + offsetY;
  const faceWidth = bounds.width * scale;
  const faceHeight = bounds.height * scale;
  const mirroredX = screenWidth - (faceX + faceWidth);

  const maxPokemonSize = Math.min(screenWidth, screenHeight) * MAX_POKEMON_SIZE_RATIO;
  const size = clamp(faceWidth / POKEMON_SIZE_DIVISOR, MIN_POKEMON_SIZE, maxPokemonSize);
  const left = clamp(
    mirroredX + faceWidth / 2 - size / 2,
    0,
    Math.max(screenWidth - size, 0),
  );
  const top = clamp(
    faceY - size * FOREHEAD_Y_OFFSET + faceHeight * 0.12,
    0,
    Math.max(screenHeight - size, 0),
  );

  return {
    width: size,
    height: size,
    left,
    top,
  };
};
