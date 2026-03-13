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
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import type { SavedPhoto } from '../../types/savedPhoto';

const BOTTOM_PADDING_BASE = 24;
const HORIZONTAL_PADDING = 24;
const SLIDE_GAP = 20;
const IMAGE_RADIUS = 16;

type Props = {
  photos: SavedPhoto[] | null;
  onRemove: (id: number, galleryUri?: string) => void;
  snapPoints: string[];
};

const PhotoDetailSheet = forwardRef<BottomSheetModal, Props>(
  ({ photos, onRemove }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    const paddingBottom = BOTTOM_PADDING_BASE + insets.bottom;
    const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef<FlatList>(null);
    const imageWidth = screenWidth - HORIZONTAL_PADDING * 2 - SLIDE_GAP;
    const slideTotalWidth = imageWidth + SLIDE_GAP;

    const safeIndex = Math.min(currentIndex, photos?.length ? photos.length - 1 : 0);
    const currentPhoto = photos?.[safeIndex] ?? null;

    useEffect(() => {
      if (photos?.length && safeIndex >= 0) {
        listRef.current?.scrollToOffset({
          offset: safeIndex * slideTotalWidth,
          animated: false,
        });
      }
    }, [photos?.length, safeIndex, slideTotalWidth]);

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
        const idx = viewableItems[0]?.index;
        if (idx != null) setCurrentIndex(idx);
      },
      [],
    );
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };

    if (!photos?.length) return null;

    const dateStr = currentPhoto
      ? new Date(currentPhoto.timestamp).toLocaleString('pl-PL', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '';

    const handleRemove = () => {
      if (!currentPhoto) return;
      onRemove(currentPhoto.id, currentPhoto.localUri);
      const next = photos.filter((p) => p.id !== currentPhoto.id);
      if (next.length === 0) (ref as React.RefObject<BottomSheetModal>)?.current?.close();
      else setCurrentIndex(Math.min(safeIndex, next.length - 1));
    };

    const renderItem = ({ item }: { item: SavedPhoto }) => (
      <View style={[styles.slide, { width: slideTotalWidth }]}>
        <View style={[styles.imageWrap, { width: imageWidth, backgroundColor: colors.border }]}>
          {item.localUri ? (
            <Image
              source={{ uri: item.localUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.imagePlaceholder, { backgroundColor: colors.border }]}>
              <ActivityIndicator size="large" color={colors.textSecondary} />
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Ładowanie…</Text>
            </View>
          )}
        </View>
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['58%', '88%']}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={[styles.background, { backgroundColor: colors.background }]}
        handleIndicatorStyle={[styles.handle, { backgroundColor: colors.border }]}
      >
        <FlatList<SavedPhoto>
          ref={listRef}
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          horizontal
          pagingEnabled={false}
          decelerationRate="fast"
          snapToInterval={slideTotalWidth}
          snapToAlignment="start"
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_data, index) => ({
            length: slideTotalWidth,
            offset: slideTotalWidth * index,
            index,
          })}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />

        {photos.length > 1 && (
          <View style={styles.dotsRow}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === safeIndex ? '#3B4CCA' : colors.border,
                    width: i === safeIndex ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>
        )}

        <View style={[styles.footer, { paddingBottom, backgroundColor: colors.background }]}>
          <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Data</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{dateStr}</Text>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Współrzędne</Text>
              <Text style={[styles.metaValue, styles.metaValueSmall, { color: colors.text }]} numberOfLines={1}>
                {currentPhoto
                  ? `${currentPhoto.latitude.toFixed(5)}, ${currentPhoto.longitude.toFixed(5)}`
                  : '—'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.removeButton, { borderColor: '#E53935', backgroundColor: 'transparent' }]}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#E53935" />
            <Text style={styles.removeButtonText}>Usuń zdjęcie z mapy i galerii</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  },
);

PhotoDetailSheet.displayName = 'PhotoDetailSheet';

export default PhotoDetailSheet;

const styles = StyleSheet.create({
  background: { borderRadius: 24 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  flatList: { flexGrow: 0 },
  flatListContent: { paddingHorizontal: HORIZONTAL_PADDING },
  slide: { marginRight: 0 },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: IMAGE_RADIUS,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: IMAGE_RADIUS,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: { fontSize: 14 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 4,
  },
  metaCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaLabel: { fontSize: 12, width: 80 },
  metaValue: { fontSize: 14, fontWeight: '600', flex: 1 },
  metaValueSmall: { fontSize: 13, fontWeight: '500' },
  metaDivider: { height: 1, marginVertical: 10, marginLeft: 28 },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  removeButtonText: { color: '#E53935', fontWeight: '600', fontSize: 15 },
});
