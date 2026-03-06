import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";

import { PokemonDetails } from "../types/pokemon";
import { pokemonTypeColors } from "../theme/pokemonTypes";

type PokemonCardProps = {
  pokemon: PokemonDetails;
  onPress?: (pokemon: PokemonDetails) => void;
  isFavorite?: boolean;
};

function PokemonCard({ pokemon, onPress, isFavorite = false }: PokemonCardProps) {
  if (!pokemon || !pokemon.sprites) return null;

  const id = pokemon.id;

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(pokemon)}
      android_ripple={{ color: "#ececec" }}
    >
      {isFavorite ? (
        <View style={styles.favoriteBadge}>
          <Ionicons name="heart" size={12} color="#111" />
        </View>
      ) : null}
      <View style={styles.imageBox}>
        {pokemon.sprites?.front_default ? (
          <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{pokemon.name}</Text>
        <Text style={styles.number}>#{String(id).padStart(3, "0")}</Text>
      </View>

      <View style={styles.types}>
        {pokemon.types?.map((t) => (
          <View
            key={t.type.name}
            style={[styles.typeDot, { backgroundColor: pokemonTypeColors[t.type.name] || "#999" }]}
          />
        ))}
      </View>
    </Pressable>
  );
}

export default memo(PokemonCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  favoriteBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f4d03f",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  imageBox: {
    width: 56,
    height: 56,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  image: {
    width: 48,
    height: 48,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  number: {
    color: "#999",
    marginTop: 2,
  },

  types: {
    flexDirection: "row",
  },

  typeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
});
