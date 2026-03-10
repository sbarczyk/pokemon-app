import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { usePokemonDetails } from '../../src/hooks/usePokemonDetails';
import { useTheme } from '../../src/context/ThemeContext';
import { DetailHeader } from '../../src/components/details/DetailHeader';
import { DetailStats } from '../../src/components/details/DetailsStats';
import { FavoriteActionButton } from '../../src/components/details/FavoriteActionButton';

export default function PokemonDetailsModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { pokemon, loading, isFavorite, handleSetAsFavorite } =
    usePokemonDetails(id);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['43%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        router.back();
      }
    },
    [router],
  );

  if (loading || !pokemon) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colors.text }]}
        backgroundStyle={[styles.sheetBackground, { backgroundColor: colors.card }]}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          <DetailHeader name={pokemon.name} types={pokemon.types} />

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: pokemon.sprites.other?.['official-artwork'].front_default,
              }}
              style={styles.mainImage}
            />
          </View>

          <DetailStats pokemon={pokemon} />

          <FavoriteActionButton
            isFavorite={isFavorite}
            onPress={handleSetAsFavorite}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetBackground: {
    backgroundColor: 'white',
    borderRadius: 32,
  },
  handleIndicator: {
    backgroundColor: '#000',
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mainImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});
