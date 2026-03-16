import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import type { SavedPhoto } from '../../types/savedPhoto';

const HORIZONTAL_PADDING = 24;
const SLIDE_GAP = 12;
const IMAGE_RADIUS = 20;

type Props = {
  photos: SavedPhoto[] | null;
  onRemove: (id: number, galleryUri?: string) => void;
};

const PhotoDetailSheet = forwardRef<BottomSheetModal, Props>(
  ({ photos, onRemove }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    
    const imageWidth = screenWidth - (HORIZONTAL_PADDING * 2);
    const slideTotalWidth = imageWidth + SLIDE_GAP;

    const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    const safeIndex = Math.min(currentIndex, photos?.length ? photos.length - 1 : 0);
    const currentPhoto = photos?.[safeIndex] ?? null;

    useEffect(() => {
      if (photos?.length && safeIndex >= 0) {
        listRef.current?.scrollToOffset({
          offset: safeIndex * slideTotalWidth,
          animated: true,
        });
      }
    }, [photos?.length]);

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
      const idx = viewableItems[0]?.index;
      if (idx != null) setCurrentIndex(idx);
    }, []);

    if (!photos?.length) return null;

    const dateStr = currentPhoto
      ? new Date(currentPhoto.timestamp).toLocaleString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    const handleRemove = () => {
      if (!currentPhoto) return;
      onRemove(currentPhoto.id, currentPhoto.localUri);
      if (photos.length === 1) {
        (ref as any)?.current?.dismiss();
      }
    };

    const renderItem = ({ item }: { item: SavedPhoto }) => (
      <View style={{ width: slideTotalWidth, paddingRight: SLIDE_GAP }}>
        <View style={[styles.imageWrap, { backgroundColor: colors.border }]}>
          <Image
            source={{ uri: item.localUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {item.isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.processingText}>Zapisywanie lokalizacji...</Text>
            </View>
          )}
        </View>
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['93%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background, borderRadius: 32 }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
      >
        <BottomSheetView style={styles.content}>
          <FlatList<SavedPhoto>
            ref={listRef}
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            horizontal
            decelerationRate="fast"
            snapToInterval={slideTotalWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
            contentContainerStyle={styles.flatListContent}
            style={styles.flatList}
          />

            <View style={styles.dotsRow}>
              {photos?.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: i === safeIndex ? '#3B4CCA' : colors.border,
                      width: i === safeIndex ? 18 : 6,
                      opacity: i === safeIndex ? 1 : 0.5,
                    },
                  ]}
                />
              ))}
            </View>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="calendar" size={16} color="#3B4CCA" />
                </View>
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Data wykonania</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{dateStr}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="location" size={16} color="#3B4CCA" />
                </View>
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Lokalizacja</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {currentPhoto?.latitude === 0 ? 'Pobieranie...' : 
                      `${currentPhoto?.latitude.toFixed(6)}, ${currentPhoto?.longitude.toFixed(6)}`}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemove}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={18} color="#FF4B4B" />
              <Text style={styles.removeButtonText}>Usuń to zdjęcie</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  content: { flex: 1 },
  flatList: { flexGrow: 0, marginTop: 12 },
  flatListContent: { paddingHorizontal: HORIZONTAL_PADDING },
  imageWrap: {
    resizeMode: 'contain',
    width: '100%',
    height: 500,
    borderRadius: IMAGE_RADIUS,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 4,
  },
  image: { width: '100%', height: '100%',  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  processingText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginVertical: 16,
  },
  dot: { height: 6, borderRadius: 3 },
  footer: { paddingHorizontal: HORIZONTAL_PADDING, flex: 1, justifyContent: 'flex-end' },
  infoContainer: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 76, 202, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, width: '100%', opacity: 0.5 },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.2)',
  },
  removeButtonText: { color: '#FF4B4B', fontWeight: '700', fontSize: 15 },
});

export default PhotoDetailSheet;