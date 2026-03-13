import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import {
  FrameFaceDetectionOptions,
  Face,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { FrameDimensions } from '../types/camera';
import { useLayoutConstants } from '../constants/constants';

export function useFaceTracking() {
  const [detectedFaces, setDetectedFaces] = useState<Face[]>([]);
  const [frameDimensions, setFrameDimensions] = useState<FrameDimensions | null>(null);
  const { SCREEN_WIDTH, SCREEN_HEIGHT } = useLayoutConstants();

  const faceDetectionOptions = useMemo<FrameFaceDetectionOptions>(() => ({
    performanceMode: 'fast',
    landmarkMode: 'none',
    classificationMode: 'none',
    cameraFacing: 'front',
    autoMode: true,
    windowWidth: SCREEN_WIDTH,
    windowHeight: SCREEN_HEIGHT,
  }), [SCREEN_WIDTH, SCREEN_HEIGHT]);

  const { detectFaces, stopListeners } = useFaceDetector(useMemo(() => faceDetectionOptions, []));

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
