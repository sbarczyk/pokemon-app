export interface SavedPhoto {
  id: number;
  localUri: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  isProcessing?: boolean;
}