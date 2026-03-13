import { StyleSheet, View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import type { SavedPhoto } from '../../types/savedPhoto';

type SavedPhotoMarkerProps = {
  /** Wszystkie zdjęcia w tym samym miejscu (do licznika i sheetu) */
  photos: SavedPhoto[];
  onPress: (photos: SavedPhoto[]) => void;
};

export default function SavedPhotoMarker({ photos, onPress }: SavedPhotoMarkerProps) {
  const { colors } = useTheme();
  const first = photos[0];
  const count = photos.length;

  return (
    <Marker
      coordinate={{ latitude: first.latitude, longitude: first.longitude }}
      onPress={() => onPress(photos)}
      tracksViewChanges={false}
    >
      <View style={[styles.markerContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="camera" size={28} color={colors.text} />
        {count > 1 && (
          <View style={[styles.badge, { backgroundColor: '#3B4CCA' }]}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3B4CCA',
    elevation: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
