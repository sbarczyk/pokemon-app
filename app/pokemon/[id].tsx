import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getPokemonDetailsById } from "../../services/pokeapi";
import { PokemonDetails } from "../../types/pokemon";
import {
  saveFavoritePokemon,
  removeFavoritePokemon,
  getFavoritePokemon,
} from "../../services/favoritePokemon";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PokemonDetailsModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const data = await getPokemonDetailsById(Number(id));
        setPokemon(data);
        
        const favorite = await getFavoritePokemon();
        setIsFavorite(favorite?.id === data.id);
      } catch (error) {
        console.error("Błąd ładowania szczegółów:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!pokemon) return;
    if (isFavorite) {
      await removeFavoritePokemon();
      setIsFavorite(false);
    } else {
      await saveFavoritePokemon(pokemon);
      setIsFavorite(true);
    }
  };

  if (loading) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );

  if (!pokemon) return (
    <View style={styles.loaderContainer}>
      <Text>Nie znaleziono pokemona.</Text>
      <TouchableOpacity onPress={() => router.back()}><Text>Wróć</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.overlay}>
      {/* Tło, które po kliknięciu zamyka modal */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => router.back()} 
      />

      <View style={styles.sheet}>
        {/* Czarny uchwyt z mockupu */}
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
            
            <View style={styles.typesContainer}>
              {pokemon.types.map((t) => (
                <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: getTypeColor(t.type.name) }]}>
                  <View style={styles.typeDot} />
                  <Text style={styles.typeText}>{t.type.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ 
                uri: pokemon.sprites.other?.["official-artwork"].front_default || pokemon.sprites.front_default 
              }}
              style={styles.image}
            />
          </View>

          <View style={styles.statsSection}>
            <StatRow label="HP" value={getStatValue(pokemon, 'hp')} icon="heart" color="#ff4d4d" />
            <StatRow label="Speed" value={getStatValue(pokemon, 'speed')} icon="flash" color="#4ade80" />
            <StatRow label="Attack" value={getStatValue(pokemon, 'attack')} icon="sword-cross" color="#fbbf24" isMCI />
            <StatRow label="Special Attack" value={getStatValue(pokemon, 'special-attack')} icon="sword-cross" color="#fbbf24" isMCI />
            <StatRow label="Defense" value={getStatValue(pokemon, 'defense')} icon="shield" color="#60a5fa" />
            <StatRow label="Special Defense" value={getStatValue(pokemon, 'special-defense')} icon="shield" color="#60a5fa" />
          </View>

          {/* Przycisk Ulubione */}
          <TouchableOpacity 
            style={[styles.favButton, isFavorite ? styles.removeFav : styles.addFav]} 
            onPress={handleToggleFavorite}
          >
            <Ionicons name={isFavorite ? "heart-dislike" : "heart"} size={22} color="white" />
            <Text style={styles.favButtonText}>
              {isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

// Funkcje pomocnicze
const getStatValue = (pokemon: PokemonDetails, name: string) => {
  return pokemon.stats.find(s => s.stat.name === name)?.base_stat || 0;
};

const StatRow = ({ label, value, icon, color, isMCI = false }: any) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueBox}>
      <Text style={styles.statValue}>{value}</Text>
      {isMCI ? (
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      ) : (
        <Ionicons name={icon} size={20} color={color} />
      )}
    </View>
  </View>
);

const getTypeColor = (type: string) => {
  const colors: any = { 
    grass: "#7AC74C", poison: "#A33EA1", fire: "#EE8130", 
    water: "#6390F0", bug: "#A6B91A", normal: "#A8A77A" 
  };
  return colors[type] || "#777";
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Przyciemnienie tła, aby było widać listę pod spodem
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: SCREEN_HEIGHT * 0.85, // Modal zajmuje 85% ekranu
    width: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginRight: 8,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  statsSection: {
    marginTop: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  statLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  statValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  favButton: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 12,
  },
  addFav: {
    backgroundColor: '#4ade80',
  },
  removeFav: {
    backgroundColor: '#f87171',
  },
  favButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});