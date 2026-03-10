import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { FavoritePokemonBannerProps } from '../../types/favoritePokemon';

export default function FavoritePokemonBanner({
  favoritePokemon,
  onRemove,
  onSeeDetails,
}: FavoritePokemonBannerProps) {
  const { colors, isDark } = useTheme();
  const removeButtonBg = isDark ? colors.border : colors.text;
  if (!favoritePokemon) return null;

  return (
    <View style={[styles.favoriteSection, { backgroundColor: colors.card }]}>
      <View style={styles.favoriteTopRow}>
        <View style={[styles.favoriteImageBox, { backgroundColor: colors.border }]}>
          {favoritePokemon.sprites?.front_default ? (
            <Image
              source={{ uri: favoritePokemon.sprites.front_default }}
              style={styles.favoriteImage}
            />
          ) : null}
        </View>
        <View style={styles.favoriteInfo}>
          <Text style={[styles.favoriteLabel, { color: colors.textSecondary }]}>YOUR FAVORITE POKEMON</Text>
          <Text style={[styles.favoriteName, { color: colors.text }]}>{favoritePokemon.name}</Text>
        </View>
      </View>
      <View style={styles.favoriteActions}>
        <Pressable
          style={[styles.favoriteButton, styles.detailsButton]}
          onPress={onSeeDetails}
        >
          <Text style={[styles.favoriteButtonText, styles.detailsButtonText]}>
            See details
          </Text>
        </Pressable>
        <Pressable
          style={[styles.favoriteButton, styles.removeButton, { backgroundColor: removeButtonBg }]}
          onPress={onRemove}
        >
          <Text style={[styles.favoriteButtonText, styles.removeButtonText]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  favoriteSection: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteImageBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteImage: {
    width: 44,
    height: 44,
  },
  favoriteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  favoriteLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  favoriteName: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  favoriteActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  detailsButton: {
    backgroundColor: '#0f0f0f',
  },
  removeButton: {},
  favoriteButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButtonText: {
    color: '#fff',
  },
  removeButtonText: {
    color: '#fff',
  },
});
