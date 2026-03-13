import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import * as MediaLibrary from 'expo-media-library';
import { Platform, PermissionsAndroid } from 'react-native';

export function normalizeFilePathToUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}

/**
 * Zapisuje zdjęcie w galerii (pamięć telefonu) i zwraca URI do podglądu.
 * Bez kopii w cache – podgląd z galerii.
 */
export async function savePhotoToGalleryAndGetUri(uri: string): Promise<string | null> {
  if (Platform.OS === 'android' && !(await hasAndroidPhotoPermission())) {
    return null;
  }

  try {
    await CameraRoll.save(uri, { type: 'photo' });
    await new Promise((r) => setTimeout(r, 400));
    const { edges } = await CameraRoll.getPhotos({ first: 1 });
    const displayUri = edges[0]?.node?.image?.uri ?? null;
    return displayUri;
  } catch (error) {
    console.error('CameraRoll save/getPhotos error:', error);
    return null;
  }
}

/**
 * Usuwa zdjęcie z galerii (pamięć telefonu).
 * URI – ten sam co w SavedPhoto.localUri (zwrócony wcześniej z getPhotos).
 * Na iOS użytkownik może zobaczyć systemowe potwierdzenie usunięcia.
 */
export async function deletePhotoFromGallery(uri: string): Promise<void> {
  try {
    await CameraRoll.deletePhotos([uri]);
  } catch (error) {
    console.error('deletePhotoFromGallery error:', error);
    throw error;
  }
}

async function hasAndroidPhotoPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const apiLevel = Platform.Version as number;
  if (apiLevel >= 33) {
    const [images, video] = await Promise.all([
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
    ]);
    if (images && video) return true;
    const statuses = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);
    return (
      statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

/** Zachowane dla kompatybilności z zapisem mapy (expo-media-library). */
export async function saveUriToGallery(uri: string): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') return false;
  try {
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch {
    return false;
  }
}
