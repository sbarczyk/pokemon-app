import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { usePokemonDetails } from "../../src/hooks/usePokemonDetails";
import { DetailHeader } from "../../src/components/details/DetailHeader";
import { DetailStats } from "../../src/components/details/DetailsStats";
import { FavoriteActionButton } from "../../src/components/details/FavoriteActionButton";

export default function PokemonDetailsModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { pokemon, loading, isFavorite, handleSetAsFavorite } = usePokemonDetails(id);

  if (loading) return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} onPress={() => router.back()} />
      <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#000" /></View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => router.back()} 
      />
      
      <View style={styles.sheet}>
        <View style={styles.handle} />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <DetailHeader name={pokemon?.name || ""} types={pokemon?.types || []} />

          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: pokemon?.sprites.other?.["official-artwork"].front_default }} 
              style={styles.mainImage} 
            />
          </View>

          <DetailStats pokemon={pokemon} />

          <FavoriteActionButton 
            isFavorite={isFavorite} 
            onPress={handleSetAsFavorite} 
          />
        </ScrollView>
      </View>
    </View>
  );
}
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: SCREEN_HEIGHT * 0.85, 
    width: "100%",
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  mainImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});