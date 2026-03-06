import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { PokemonDetails } from "../../types/pokemon";
import { FavoritePokemonBannerProps } from "../../types/favoritePokemon";

export default function FavoritePokemonBanner({
  favoritePokemon,
  onRemove,
  onSeeDetails,
}: FavoritePokemonBannerProps) {
  if (!favoritePokemon) return null;

  return (
    <View style={styles.favoriteSection}>
      <View style={styles.favoriteTopRow}>
        <View style={styles.favoriteImageBox}>
          {favoritePokemon.sprites?.front_default ? (
            <Image
              source={{ uri: favoritePokemon.sprites.front_default }}
              style={styles.favoriteImage}
            />
          ) : null}
        </View>
        <View style={styles.favoriteInfo}>
          <Text style={styles.favoriteLabel}>YOUR FAVORITE POKEMON</Text>
          <Text style={styles.favoriteName}>{favoritePokemon.name}</Text>
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
          style={[styles.favoriteButton, styles.removeButton]}
          onPress={onRemove}
        >
          <Text style={styles.favoriteButtonText}>Remove</Text>
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteImageBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#8b8b8b",
    fontWeight: "600",
  },
  favoriteName: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#111",
  },
  favoriteActions: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  favoriteButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  detailsButton: {
    backgroundColor: "#0f0f0f",
  },
  removeButton: {
    backgroundColor: "#e8e8e8",
  },
  favoriteButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  detailsButtonText: {
    color: "#fff",
  },
});
