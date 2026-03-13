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
import { useSavedPhotos } from '../../src/hooks/useSavedPhotos';
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
  const { addPhoto } = useSavedPhotos();
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

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Brak dostępu do lokalizacji',
        'Aby zapisać zdjęcie z lokalizacją, zezwól na dostęp do lokalizacji.',
      );
      return;
    }

    setIsCapturing(true);
    try {
      setLoadingPhase('photo');
      const photo = await cameraRef.current.takePhoto();
      const photoUri = normalizeFilePathToUri(photo.path);

      const assetUri = await savePhotoToGalleryAndGetUri(photoUri);
      if (!assetUri) {
        Alert.alert('Brak uprawnień', 'Nadaj dostęp do zdjęć, aby zapisać w galerii.');
        return;
      }

      setLoadingPhase('location');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      await addPhoto({
        id: Date.now(),
        localUri: assetUri,
        latitude,
        longitude,
        timestamp: Date.now(),
      });

      Alert.alert('Zapisano', 'Zdjęcie zapisane w galerii z lokalizacją. Zobaczysz je na mapie.');
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Nie udało się zapisać zdjęcia.');
    } finally {
      setIsCapturing(false);
      setLoadingPhase(null);
    }
  }, [addPhoto, isCapturing]);

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
        ref={cameraRef}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        detectedFaces={detectedFaces}
        frameDimensions={frameDimensions}
        onInitialized={onInitialized}
        onError={onError}
      />
      {isCapturing && loadingPhase && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            {loadingPhase === 'photo'
              ? 'Zapisywanie zdjęcia…'
              : 'Pobieranie lokalizacji…'}
          </Text>
        </View>
      )}
      <FloatingActionButton
        label={isCapturing ? 'Zapisuję…' : 'Zrób zdjęcie'}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
