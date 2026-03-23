import AsyncStorage from "@react-native-async-storage/async-storage";
import PokemonPin from "../types/pokemonPin";

const STORAGE_KEY = 'pokemon_pins';

const trimPin = (pin: PokemonPin): PokemonPin => ({
  id: pin.id,
  latitude: pin.latitude,
  longitude: pin.longitude,
  pokemonDetails: {
    id: pin.pokemonDetails.id,
    name: pin.pokemonDetails.name,
    sprites: {
      front_default: pin.pokemonDetails.sprites.front_default,
      other: pin.pokemonDetails.sprites.other,
    },
    types: pin.pokemonDetails.types,
    stats: pin.pokemonDetails.stats,
  },
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