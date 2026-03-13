import { ComponentProps, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, CameraDevice, CameraRuntimeError } from 'react-native-vision-camera';
import { Face } from 'react-native-vision-camera-face-detector';

import { FrameDimensions } from '../../types/camera';
import FaceDetectedBadge from './FaceDetectedBadge';
import { FaceOverlay } from './FaceOverlay';

type CameraPreviewProps = {
  device: CameraDevice;
  isActive: boolean;
  frameProcessor: ComponentProps<typeof Camera>['frameProcessor'];
  detectedFaces: Face[];
  frameDimensions: FrameDimensions | null;
  onInitialized: () => void;
  onError: (error: CameraRuntimeError) => void;
};

const CameraPreview = forwardRef<Camera, CameraPreviewProps>(function CameraPreview(
  {
    device,
    isActive,
    frameProcessor,
    detectedFaces,
    frameDimensions,
    onInitialized,
    onError,
  },
  ref,
) {
  return (
    <>
      <Camera
        ref={ref}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
        frameProcessor={frameProcessor}
        onInitialized={onInitialized}
        onError={onError}
        androidPreviewViewType="texture-view"
      />

      <FaceOverlay faces={detectedFaces} frameDimensions={frameDimensions} />

      {detectedFaces.length > 0 && <FaceDetectedBadge />}
    </>
  );
});

export default CameraPreview;
