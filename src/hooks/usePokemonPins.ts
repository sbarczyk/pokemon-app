import { useCallback, useEffect, useState } from 'react';

import { getPokemonPinsFromStorage, savePokemonPinsToStorage } from '../services/pinPokemon';
import PokemonPin from '../types/pokemonPin';

export function usePokemonPins() {
  const [pokemonPins, setPokemonPins] = useState<PokemonPin[]>([]);

  useEffect(() => {
    getPokemonPinsFromStorage().then(setPokemonPins);
  }, []);

  const addPin = useCallback(
    async (pin: PokemonPin) => {
      const updatedPins = [...pokemonPins, pin];
      setPokemonPins(updatedPins);
      await savePokemonPinsToStorage(updatedPins);
    },
    [pokemonPins],
  );

  const removePin = useCallback(
    async (id: number) => {
      const updatedPins = pokemonPins.filter((pin) => pin.id !== id);
      setPokemonPins(updatedPins);
      await savePokemonPinsToStorage(updatedPins);
      return updatedPins;
    },
    [pokemonPins],
  );

  return {
    pokemonPins,
    addPin,
    removePin,
  };
}
