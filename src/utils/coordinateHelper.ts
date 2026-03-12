import { Face } from 'react-native-vision-camera-face-detector';

import { OverlayPosition } from '../types/camera';

type Point = { x: number; y: number };

type MappingOptions = {
  isMirrored?: boolean;
};

type OrientedPoint = {
  point: Point;
  width: number;
  height: number;
};

const orientPoint = (
  point: Point,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): OrientedPoint => {
  const sourceIsLandscape = sourceWidth > sourceHeight;
  const targetIsLandscape = targetWidth > targetHeight;

  if (sourceIsLandscape === targetIsLandscape) {
    return {
      point,
      width: sourceWidth,
      height: sourceHeight,
    };
  }

  if (sourceIsLandscape && !targetIsLandscape) {
    return {
      point: {
        x: point.y,
        y: sourceWidth - point.x,
      },
      width: sourceHeight,
      height: sourceWidth,
    };
  }

  return {
    point: {
      x: sourceHeight - point.y,
      y: point.x,
    },
    width: sourceHeight,
    height: sourceWidth,
  };
};

const mapPointToTarget = (
  point: Point,
  targetWidth: number,
  targetHeight: number,
  sourceWidth: number,
  sourceHeight: number,
  options?: MappingOptions,
): Point => {
  const oriented = orientPoint(point, sourceWidth, sourceHeight, targetWidth, targetHeight);
  const mirroredX = options?.isMirrored
    ? oriented.width - oriented.point.x
    : oriented.point.x;

  const scale = Math.max(
    targetWidth / oriented.width,
    targetHeight / oriented.height,
  );
  const renderedWidth = oriented.width * scale;
  const renderedHeight = oriented.height * scale;
  const offsetX = (targetWidth - renderedWidth) / 2;
  const offsetY = (targetHeight - renderedHeight) / 2;

  return {
    x: offsetX + mirroredX * scale,
    y: offsetY + oriented.point.y * scale,
  };
};

export const calculatePokemonPosition = (
  face: Face,
  targetWidth: number,
  targetHeight: number,
  frameWidth: number,
  frameHeight: number,
  options?: MappingOptions,
): OverlayPosition => {
  const map = (point: Point) =>
    mapPointToTarget(
      point,
      targetWidth,
      targetHeight,
      frameWidth,
      frameHeight,
      options,
    );

  const { x, y, width, height } = face.bounds;
  const topLeft = map({ x, y });
  const bottomRight = map({ x: x + width, y: y + height });

  const faceLeft = Math.min(topLeft.x, bottomRight.x);
  const faceTop = Math.min(topLeft.y, bottomRight.y);
  const faceWidth = Math.abs(bottomRight.x - topLeft.x);
  const faceHeight = Math.abs(bottomRight.y - topLeft.y);
  const size = Math.max(faceWidth, faceHeight) * 0.65;

  let centerX = faceLeft + faceWidth / 2;
  const leftEye = face.landmarks?.LEFT_EYE;
  const rightEye = face.landmarks?.RIGHT_EYE;

  if (leftEye && rightEye) {
    const mappedLeftEye = map(leftEye);
    const mappedRightEye = map(rightEye);
    centerX = (mappedLeftEye.x + mappedRightEye.x) / 2;
  }

  const rollAngle = face.rollAngle ?? 0;
  const correctedRollAngle = options?.isMirrored ? -rollAngle : rollAngle;

  return {
    width: size,
    height: size,
    left: centerX - size / 2,
    top: faceTop + faceHeight * 0.1 - size / 2,
    transform: [{ rotate: `${correctedRollAngle}deg` }],
  };
};
