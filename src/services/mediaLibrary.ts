import * as MediaLibrary from 'expo-media-library';

export async function saveUriToGallery(uri: string): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }

  await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}

export function normalizeFilePathToUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}
