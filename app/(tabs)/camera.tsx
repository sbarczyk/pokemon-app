import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import CameraPreview from '../../src/components/camera/CameraPreview';
import CameraStatusMessage from '../../src/components/camera/CameraStatusMessage';
import { useFaceTracking } from '../../src/hooks/useFaceTracking';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [cameraReady, setCameraReady] = useState(false);
  const { detectedFaces, frameDimensions, frameProcessor } = useFaceTracking();

  useEffect(() => {
    if (!isFocused) {
      setCameraReady(false);
      return;
    }

    const timeout = setTimeout(() => setCameraReady(true), 300);
    return () => clearTimeout(timeout);
  }, [isFocused]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!device) {
    return <CameraStatusMessage message="Nie znaleziono aparatu." />;
  }

  if (!hasPermission) {
    return <CameraStatusMessage message="Brak uprawnień do aparatu." />;
  }

  const isActive = isFocused && cameraReady;

  return (
    <View style={styles.container}>
      <CameraPreview
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        detectedFaces={detectedFaces}
        frameDimensions={frameDimensions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
