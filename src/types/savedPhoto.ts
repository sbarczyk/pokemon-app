export interface SavedPhoto {
  id: number;
  /** URI z galerii (pamięć telefonu) – do podglądu w aplikacji */
  localUri: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}
