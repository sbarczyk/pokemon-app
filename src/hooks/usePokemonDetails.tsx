import { useState, useEffect, useCallback, useRef } from 'react';
import { getPokemonDetailsById } from '../services/pokeapi';
import { getCachedPokemonDetails } from '../services/pokemonDetailCache';
import { PokemonDetails } from '../types/pokemon';
import { useFavorites } from '../context/FavoriteContext';

function parseId(id: string | string[]): number | null {
  const raw = Array.isArray(id) ? id[0] : id;
  if (raw == null) return null;
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
}

export function usePokemonDetails(id: string | string[]) {
  const idNum = parseId(id);
  const cachedInitial = idNum != null ? getCachedPokemonDetails(idNum) : null;
  const hadCachedData = useRef(cachedInitial != null);

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(cachedInitial);
  const [loading, setLoading] = useState(cachedInitial === null);
  const { favorite, toggleFavorite } = useFavorites();

  const isFavorite = favorite?.id === pokemon?.id;

  const fetchDetails = useCallback(async () => {
    if (idNum == null) return;
    try {
      setLoading(true);
      const data = await getPokemonDetailsById(idNum);
      setPokemon(data);
    } catch (error) {
      console.error('Error loading pokemon details:', error);
    } finally {
      setLoading(false);
    }
  }, [idNum]);

  useEffect(() => {
    if (hadCachedData.current) return;
    fetchDetails();
  }, [fetchDetails]);

  const handleSetAsFavorite = async () => {
    if (pokemon) await toggleFavorite(pokemon);
  };

  return { pokemon, loading, isFavorite, handleSetAsFavorite };
}
