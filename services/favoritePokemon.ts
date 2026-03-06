import AsyncStorage from "@react-native-async-storage/async-storage";

import { PokemonDetails } from "../types/pokemon";

const FAVORITE_POKEMON_KEY = "favorite_pokemon";

export async function getFavoritePokemon(): Promise<PokemonDetails | null> {
  const raw = await AsyncStorage.getItem(FAVORITE_POKEMON_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PokemonDetails;
  } catch {
    return null;
  }
}

export async function saveFavoritePokemon(pokemon: PokemonDetails): Promise<void> {
  await AsyncStorage.setItem(FAVORITE_POKEMON_KEY, JSON.stringify(pokemon));
}

export async function removeFavoritePokemon(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITE_POKEMON_KEY);
}
