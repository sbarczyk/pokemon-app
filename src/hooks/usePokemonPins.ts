import { useCallback, useEffect, useState } from 'react';

import { getPokemonPinsFromStorage, savePokemonPinsToStorage } from '../services/pinPokemon';
import PokemonPin from '../types/pokemonPin';

export function usePokemonPins() {
  const [pokemonPins, setPokemonPins] = useState<PokemonPin[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    getPokemonPinsFromStorage().then((pins) => {
      setPokemonPins(pins);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePokemonPinsToStorage(pokemonPins).catch(console.error);
  }, [pokemonPins, hydrated]);

  const addPin = useCallback((pin: PokemonPin) => {
    setPokemonPins((prev) => [...prev, pin]);
  }, []);

  const removePin = useCallback((id: number) => {
    setPokemonPins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    pokemonPins,
    addPin,
    removePin,
  };
}
