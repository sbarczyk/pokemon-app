import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../context/ThemeContext';
import { PokemonDetailContent } from './PokemonDetailContent';
import type { PokemonDetails } from '../../types/pokemon';

const BOTTOM_PADDING_BASE = 24;
const DEFAULT_SNAP_POINTS = ['55%', '92%'];

export type DetailsModalProps = {
  /** Gdy null (np. po zamknięciu na mapie), modal zostaje w drzewie, ale treść jest pusta */
  pokemon: PokemonDetails | null;
  imageUri: string;
  actionButton: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
  backdropComponent?: React.ComponentType<any> | null;
  containerComponent?: React.ComponentType<{ children?: React.ReactNode }> | null;
};

const DetailsModal = forwardRef<BottomSheetModal, DetailsModalProps>(
  (
    {
      pokemon,
      imageUri,
      actionButton,
      snapPoints = DEFAULT_SNAP_POINTS,
      onDismiss,
      backdropComponent,
      containerComponent,
    },
    ref
  ) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const contentPaddingBottom = BOTTOM_PADDING_BASE + insets.bottom;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        onDismiss={onDismiss}
        backdropComponent={(backdropComponent ?? undefined) as typeof BottomSheetBackdrop | undefined}
        containerComponent={containerComponent ?? undefined}
        backgroundStyle={[styles.modalBackground, { backgroundColor: colors.card }]}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.modalContent,
            { paddingBottom: contentPaddingBottom },
          ]}
        >
          {pokemon ? (
            <PokemonDetailContent
              pokemon={pokemon}
              imageUri={imageUri}
              actionButton={actionButton}
            />
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

DetailsModal.displayName = 'DetailsModal';

export default DetailsModal;

const styles = StyleSheet.create({
  modalBackground: {
    borderRadius: 24,
  },
  modalContent: {
    paddingHorizontal: 20,
  },
});
