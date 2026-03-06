import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import PokemonCard from "../../components/PokemonCard";
import FavoritePokemonBanner from "../../components/pokedex/FavoritePokemonBanner";
import PokedexHeader from "../../components/pokedex/PokedexHeader";
import PokedexSearchBar from "../../components/pokedex/PokedexSearchBar";
import { usePokedex } from "../../hooks/usePokedex";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokedexScreen() {
  const router = useRouter();
  const {
    favoritePokemon,
    searchQuery,
    setSearchQuery,
    filteredPokemon,
    displayCount,
    isRefreshing,
    setFavorite,
    clearFavorite,
    refreshPokemon,
    loadMorePokemon,
  } = usePokedex();

  function handleSeeFavoriteDetails() {
    if (!favoritePokemon) return;
    router.push(`/pokemon/${favoritePokemon.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <PokedexHeader />
      <FavoritePokemonBanner
        favoritePokemon={favoritePokemon}
        onRemove={clearFavorite}
        onSeeDetails={handleSeeFavoriteDetails}
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
            onPress={setFavorite}
            isFavorite={favoritePokemon?.id === item.id}
          />
        )}
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refreshPokemon}
        initialNumToRender={20}
        maxToRenderPerBatch={8}
        windowSize={10}
        removeClippedSubviews
        contentContainerStyle={[
          styles.listContent,
          filteredPokemon.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          searchQuery.trim() ? (
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchText}>No pokemon matching: {searchQuery.trim()}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  count: {
    color: "#888",
  },
  listContent: {
    paddingBottom: 0,
  },

  listContentEmpty: {
    flexGrow: 1,
  },

  emptySearch: {
    padding: 32,
    alignItems: "center",
  },

  emptySearchText: {
    fontSize: 16,
    color: "#888",
  },
});
