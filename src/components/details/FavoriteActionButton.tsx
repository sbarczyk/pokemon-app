import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  isFavorite: boolean;
  onPress: () => void;
};

const FAVORITE_RED = '#FF4757';

export const FavoriteActionButton = ({ isFavorite, onPress }: Props) => {
  const { colors } = useTheme();
  const notFavoriteBg = '#1A1A1A';
  const notFavoriteText = '#fff';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFavorite
          ? { backgroundColor: colors.border, borderColor: FAVORITE_RED }
          : { backgroundColor: notFavoriteBg, borderColor: notFavoriteBg },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          { color: isFavorite ? FAVORITE_RED : notFavoriteText },
        ]}
      >
        {isFavorite ? 'Remove from Favorites' : 'Set as my Favorite'}
      </Text>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
        color={isFavorite ? FAVORITE_RED : notFavoriteText}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    marginBottom: 30,
    gap: 12,
    borderWidth: 2,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
});