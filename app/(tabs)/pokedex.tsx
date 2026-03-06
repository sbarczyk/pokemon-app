import React from "react";
import { ActivityIndicator, FlatList, Text, View, Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { usePokemonList } from "../../src/hooks/usePokemonList";
import { usePokemonSearch } from "../../src/hooks/usePokemonSearch";
import { useFavorites } from "../../src/context/FavoriteContext";
import { usePokedexInteractions } from "../../src/hooks/usePokedexInteractions";

import PokemonCard from "../../src/components/pokedex/PokemonCard";
import FavoritePokemonBanner from "../../src/components/pokedex/FavoritePokemonBanner";
import PokedexHeader from "../../src/components/pokedex/PokedexHeader";
import PokedexSearchBar from "../../src/components/pokedex/PokedexSearchBar";
import { useRouter } from "expo-router";

export default function PokedexScreen() {
  const { pokemon, isRefreshing, isLoadingMore, refreshPokemon, loadMore } = usePokemonList();
  const { searchQuery, setSearchQuery, filteredPokemon, displayCount, isSearching, normalizedQuery } = usePokemonSearch(pokemon);
  const { favorite, toggleFavorite, clearFavorite } = useFavorites();
  const router = useRouter();

  const { handlePokemonPress, heartVisible, animatedValue } = usePokedexInteractions(toggleFavorite);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <PokedexHeader />
      
      <FavoritePokemonBanner 
        favoritePokemon={favorite} 
        onRemove={clearFavorite} 
        onSeeDetails={() => favorite && router.push(`/pokemon/${favorite.id}`)} 
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>Pokedex</Text>
        <Text style={styles.count}>{displayCount} pokemons found</Text>
      </View>

      <PokedexSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard 
            pokemon={item} 
            onPress={() => handlePokemonPress(item)} 
            isFavorite={favorite?.id === item.id} 
          />
        )}
        onEndReached={!isSearching ? loadMore : null}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refreshPokemon}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" style={styles.loader} /> : null}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={normalizedQuery ? (
          <View style={styles.emptySearch}>
            <Text style={styles.emptySearchText}>No pokemon matching: "{normalizedQuery}"</Text>
          </View>
        ) : null}
      />

      {heartVisible && (
        <View style={styles.heartOverlay} pointerEvents="none">
          <Animated.View style={{ transform: [{ scale: animatedValue }], opacity: animatedValue }}>
            <Ionicons name="heart" size={120} color="#FF4757" />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  titleRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111" },
  count: { color: "#888", fontSize: 14 },
  listContent: { paddingBottom: 20 },
  loader: { marginVertical: 16 },
  emptySearch: { padding: 32, alignItems: "center" },
  emptySearchText: { fontSize: 16, color: "#888", textAlign: "center" },
  heartOverlay: { 
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 100 
  }
});