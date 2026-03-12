import { OverlayPosition } from '../types/camera';

const getRotation = (position?: OverlayPosition) => {
  const rotateValue = position?.transform?.[0]?.rotate;
  if (!rotateValue) {
    return 0;
  }

  return Number.parseFloat(rotateValue.replace('deg', '')) || 0;
};

export function smoothOverlayPosition(
  rawPosition: OverlayPosition,
  previousPosition?: OverlayPosition,
  alpha = 0.65,
): OverlayPosition {
  if (!previousPosition) {
    return rawPosition;
  }

  const smoothedRotation =
    getRotation(previousPosition) +
    (getRotation(rawPosition) - getRotation(previousPosition)) * alpha;

  return {
    ...rawPosition,
    left: previousPosition.left + (rawPosition.left - previousPosition.left) * alpha,
    top: previousPosition.top + (rawPosition.top - previousPosition.top) * alpha,
    width: previousPosition.width + (rawPosition.width - previousPosition.width) * alpha,
    height: previousPosition.height + (rawPosition.height - previousPosition.height) * alpha,
    transform: [{ rotate: `${smoothedRotation}deg` }],
  };
}
