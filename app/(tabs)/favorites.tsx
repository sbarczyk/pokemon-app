import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PokemonDetails } from "../../types/pokemon";
import {
  getFavoritePokemon,
  removeFavoritePokemon,
} from "../../services/favoritePokemon";

export default function FavoritesScreen() {
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonDetails | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      getFavoritePokemon()
        .then(setFavoritePokemon)
        .catch(() => setFavoritePokemon(null));
    }, [])
  );

  async function handleRemoveFavorite() {
    await removeFavoritePokemon();
    setFavoritePokemon(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorite Pokemon</Text>

      {!favoritePokemon ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No favorite yet</Text>
          <Text style={styles.emptyText}>
            Select a favorite from the Pokedex screen.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.imageBox}>
              {favoritePokemon.sprites?.front_default ? (
                <Image
                  source={{ uri: favoritePokemon.sprites.front_default }}
                  style={styles.image}
                />
              ) : null}
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>YOUR FAVORITE POKEMON</Text>
              <Text style={styles.name}>{favoritePokemon.name}</Text>
              <Text style={styles.number}>
                #{String(favoritePokemon.id).padStart(3, "0")}
              </Text>
            </View>
          </View>
          <Pressable style={styles.removeButton} onPress={handleRemoveFavorite}>
            <Text style={styles.removeButtonText}>Remove favorite</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 52,
    height: 52,
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: "#8b8b8b",
    fontWeight: "600",
  },
  name: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#111",
  },
  number: {
    marginTop: 2,
    color: "#777",
    fontSize: 14,
  },
  removeButton: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
