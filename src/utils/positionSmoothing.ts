import { OverlayPosition } from '../types/camera';

export function smoothOverlayPosition(
  rawPosition: OverlayPosition,
  previousPosition?: OverlayPosition,
  alpha = 0.65,
): OverlayPosition {
  if (!previousPosition) {
    return rawPosition;
  }

  return {
    ...rawPosition,
    left: previousPosition.left + (rawPosition.left - previousPosition.left) * alpha,
    top: previousPosition.top + (rawPosition.top - previousPosition.top) * alpha,
    width: previousPosition.width + (rawPosition.width - previousPosition.width) * alpha,
    height: previousPosition.height + (rawPosition.height - previousPosition.height) * alpha,
  };
}
