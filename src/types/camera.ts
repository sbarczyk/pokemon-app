export type FrameDimensions = {
  width: number;
  height: number;
};

export type OverlayPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Rotation in degrees (from face.rollAngle), so sprite tilts with head. */
  rotateDeg: number;
};
