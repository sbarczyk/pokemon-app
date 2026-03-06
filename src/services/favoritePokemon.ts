import AsyncStorage from '@react-native-async-storage/async-storage';
import { PokemonDetails } from '../types/pokemon';

const FAVORITE_KEY = 'favorite_pokemon_data';

export const getFavoritePokemon = async (): Promise<PokemonDetails | null> => {
  const data = await AsyncStorage.getItem(FAVORITE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveFavoritePokemon = async (pokemon: PokemonDetails) => {
  await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(pokemon));
};

export const removeFavoritePokemon = async () => {
  await AsyncStorage.removeItem(FAVORITE_KEY);
};
