import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { Face } from 'react-native-vision-camera-face-detector';

import FaceDetectedBadge from './FaceDetectedBadge';
import { FaceOverlay } from './FaceOverlay';
import { FrameDimensions } from '../../types/camera';

type CameraPreviewProps = {
  device: CameraDevice;
  isActive: boolean;
  frameProcessor: ComponentProps<typeof Camera>['frameProcessor'];
  detectedFaces: Face[];
  frameDimensions: FrameDimensions | null;
};

export default function CameraPreview({
  device,
  isActive,
  frameProcessor,
  detectedFaces,
  frameDimensions,
}: CameraPreviewProps) {
  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        androidPreviewViewType="texture-view"
      />

      <FaceOverlay faces={detectedFaces} frameDimensions={frameDimensions} />

      {detectedFaces.length > 0 && <FaceDetectedBadge />}
    </>
  );
}
