import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { CameraRuntimeError, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import CameraPreview from '../../src/components/camera/CameraPreview';
import CameraStatusMessage from '../../src/components/camera/CameraStatusMessage';
import { useFaceTracking } from '../../src/hooks/useFaceTracking';
import { useIsForeground } from '../../src/hooks/useIsForeground';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const { detectedFaces, frameDimensions, frameProcessor } = useFaceTracking();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  if (!device) {
    return <CameraStatusMessage message="Nie znaleziono aparatu." />;
  }

  if (!hasPermission) {
    return <CameraStatusMessage message="Brak uprawnień do aparatu." />;
  }

  const isActive = isFocused && isForeground && isCameraInitialized;

  return (
    <View style={styles.container}>
      <CameraPreview
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        detectedFaces={detectedFaces}
        frameDimensions={frameDimensions}
        onInitialized={onInitialized}
        onError={onError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
