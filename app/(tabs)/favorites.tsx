import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../src/context/FavoriteContext';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorite, clearFavorite, isLoading } = useFavorites();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Favorite Pokemon</Text>

      {!favorite ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorite yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Select a favorite from the Pokedex screen.
          </Text>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.imageBox, { backgroundColor: colors.border }]}>
            <Image
              source={{
                uri:
                  favorite.sprites.other?.['official-artwork'].front_default ||
                  favorite.sprites.front_default,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.info}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>YOUR FAVORITE POKEMON</Text>
            <Text style={[styles.name, { color: colors.text }]}>{favorite.name}</Text>
            <Text style={[styles.number, { color: colors.textSecondary }]}>
              #{String(favorite.id).padStart(3, '0')}
            </Text>

            <Pressable style={[styles.removeButton, { backgroundColor: colors.button }]} onPress={clearFavorite}>
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text style={styles.removeButtonText}>Remove favorite</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 8 },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageBox: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: 200, height: 200 },
  info: { padding: 24 },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  number: { fontSize: 16, marginBottom: 20 },
  removeButton: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
