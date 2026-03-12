export type FrameDimensions = {
  width: number;
  height: number;
};

export type OverlayPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
  transform?: Array<{ rotate: string }>;
};
