import { useState, useEffect, useCallback } from 'react';
import { getPokemonDetailsById } from '../services/pokeapi';
import { PokemonDetails } from '../types/pokemon';
import { useFavorites } from '../context/FavoriteContext';

export function usePokemonDetails(id: string | string[]) {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorite, toggleFavorite } = useFavorites();

  const isFavorite = favorite?.id === pokemon?.id;

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getPokemonDetailsById(Number(id));
      setPokemon(data);
    } catch (error) {
      console.error('Error loading pokemon details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleSetAsFavorite = async () => {
    if (pokemon) await toggleFavorite(pokemon);
  };

  return { pokemon, loading, isFavorite, handleSetAsFavorite };
}
