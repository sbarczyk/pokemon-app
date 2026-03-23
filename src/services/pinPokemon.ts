import AsyncStorage from "@react-native-async-storage/async-storage";
import PokemonPin from "../types/pokemonPin";
import { normalizePokemonFromApi } from '../utils/normalizePokemonFromApi';

const STORAGE_KEY = 'pokemon_pins';

/** Zapisujemy tylko pola używane w UI (zgodne z normalizePokemonFromApi). */
const trimPin = (pin: PokemonPin): PokemonPin => ({
  id: pin.id,
  latitude: pin.latitude,
  longitude: pin.longitude,
  pokemonDetails: normalizePokemonFromApi(pin.pokemonDetails),
});

export const savePokemonPinsToStorage = async (pins: PokemonPin[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins.map(trimPin)));
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