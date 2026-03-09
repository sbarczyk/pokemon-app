import AsyncStorage from "@react-native-async-storage/async-storage";
import PokemonPin from "../types/pokemonPin";

const STORAGE_KEY = 'pokemon_pins';

export const savePokemonPinsToStorage = async (pins: PokemonPin[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
  } catch (error) {
    console.error('Error saving pokemon pins:', error);
  }
};

export const getPokemonPinsFromStorage = async (): Promise<PokemonPin[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pokemon pins:', error);
    return [];
  }
};