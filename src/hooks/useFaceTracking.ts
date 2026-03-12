import { useEffect, useRef, useState } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import {
  FrameFaceDetectionOptions,
  Face,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { FrameDimensions } from '../types/camera';

export function useFaceTracking() {
  const [detectedFaces, setDetectedFaces] = useState<Face[]>([]);
  const [frameDimensions, setFrameDimensions] = useState<FrameDimensions | null>(null);

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all',
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    return () => {
      stopListeners();
    };
  }, [stopListeners]);

  const handleDetectedFaces = Worklets.createRunOnJS(
    (faces: Face[], frameWidth: number, frameHeight: number) => {
      setDetectedFaces(faces);
      setFrameDimensions({ width: frameWidth, height: frameHeight });
    },
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const faces = detectFaces(frame);
      handleDetectedFaces(faces, frame.width, frame.height);
    },
    [detectFaces, handleDetectedFaces],
  );

  return {
    detectedFaces,
    frameDimensions,
    frameProcessor,
  };
}
