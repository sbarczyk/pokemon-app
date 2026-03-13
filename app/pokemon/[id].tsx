import React, { useCallback, useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FullWindowOverlay } from 'react-native-screens';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { ReactNode } from 'react';

import { usePokemonDetails } from '../../src/hooks/usePokemonDetails';
import { useTheme } from '../../src/context/ThemeContext';
import DetailsModal from '../../src/components/details/DetailsModal';
import { FavoriteActionButton } from '../../src/components/details/FavoriteActionButton';
import { getPokemonImageUrl } from '../../src/utils/pokemon';

const ModalContainer = ({ children }: { children?: ReactNode }) =>
  Platform.OS === 'ios' ? (
    <FullWindowOverlay>{children}</FullWindowOverlay>
  ) : (
    <>{children}</>
  );

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { pokemon, loading, isFavorite, handleSetAsFavorite } =
    usePokemonDetails(id);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    if (!pokemon) return;
    const t = setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 50);
    return () => clearTimeout(t);
  }, [pokemon]);

  if (loading || !pokemon) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  const actionButton = (
    <View style={styles.favoriteButtonWrapper}>
      <FavoriteActionButton
        isFavorite={isFavorite}
        onPress={handleSetAsFavorite}
      />
    </View>
  );

  const modalContent = (
    <DetailsModal
      ref={bottomSheetRef}
      pokemon={pokemon}
      imageUri={getPokemonImageUrl(pokemon)}
      actionButton={actionButton}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      containerComponent={ModalContainer}
    />
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? (
        <BottomSheetModalProvider>{modalContent}</BottomSheetModalProvider>
      ) : (
        modalContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonWrapper: {
    marginTop: 0,
  },
});
