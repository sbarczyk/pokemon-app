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
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorite, clearFavorite, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorite Pokemon</Text>

      {!favorite ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No favorite yet</Text>
          <Text style={styles.emptyText}>
            Select a favorite from the Pokedex screen.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.imageBox}>
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
            <Text style={styles.label}>YOUR FAVORITE POKEMON</Text>
            <Text style={styles.name}>{favorite.name}</Text>
            <Text style={styles.number}>
              #{String(favorite.id).padStart(3, '0')}
            </Text>

            <Pressable style={styles.removeButton} onPress={clearFavorite}>
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#222', marginTop: 12 },
  emptyText: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageBox: {
    backgroundColor: '#f9f9f9',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: 200, height: 200 },
  info: { padding: 24 },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#aaa',
    fontWeight: '700',
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    textTransform: 'capitalize',
    color: '#111',
  },
  number: { fontSize: 16, color: '#777', marginBottom: 20 },
  removeButton: {
    backgroundColor: '#111',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
