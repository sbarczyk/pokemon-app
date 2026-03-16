import { StyleSheet, View, Alert, ActivityIndicator, Text } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import * as Location from 'expo-location';

import CameraPreview from '../../src/components/camera/CameraPreview';
import CameraStatusMessage from '../../src/components/camera/CameraStatusMessage';
import FloatingActionButton from '../../src/components/common/FloatingActionButton';
import { useFaceTracking } from '../../src/hooks/useFaceTracking';
import { useIsForeground } from '../../src/hooks/useIsForeground';
import { usePhotos } from '../../src/context/PhotosContext';
import {
  normalizeFilePathToUri,
  savePhotoToGalleryAndGetUri,
} from '../../src/services/mediaLibrary';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [loadingPhase, setLoadingPhase] = useState<'photo' | 'location' | null>(null);
  
  const { detectedFaces, frameDimensions, frameProcessor } = useFaceTracking();
  const { addPhoto, updatePhoto } = usePhotos();
  const cameraRef = useRef<Camera>(null);

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

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('No location', 'Allow GPS in settings.');
        return;
      }
    }

    try {
      setIsCapturing(true);
      setLoadingPhase('photo');

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(() => null);

      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });

      const tempId = Date.now();
      const initialUri = normalizeFilePathToUri(photo.path);

      addPhoto({
        id: tempId,
        localUri: initialUri,
        latitude: 0,
        longitude: 0,
        timestamp: tempId,
      });

      setIsCapturing(false);
      setLoadingPhase(null);

      (async () => {
        try {
          const [assetUri, location] = await Promise.all([
            savePhotoToGalleryAndGetUri(initialUri),
            locationPromise,
          ]);
          updatePhoto(tempId, {
            localUri: assetUri || initialUri,
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          });
        } catch (e) {
          console.error("Background task error:", e);
        }
      })();

    } catch (error) {
      console.error(error);
      setIsCapturing(false);
      setLoadingPhase(null);
      Alert.alert('Error', 'Failed to save photo.');
    }
  }, [addPhoto, updatePhoto, isCapturing]);

  if (!device) return <CameraStatusMessage message="Camera not found." />;
  if (!hasPermission) return <CameraStatusMessage message="No camera permission." />;

  const isActive = isFocused && isForeground && isCameraInitialized;

  return (
    <View style={styles.container}>
      <CameraPreview
        ref={cameraRef}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        detectedFaces={detectedFaces}
        frameDimensions={frameDimensions}
        onInitialized={onInitialized}
        onError={onError}
      />
      
      {isCapturing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Przetwarzanie...</Text>
        </View>
      )}

      <FloatingActionButton
        label={isCapturing ? '...' : 'Take photo'}
        onPress={handleTakePhoto}
        position="bottomCenter"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});