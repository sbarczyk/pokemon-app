import { useState, useMemo } from 'react';
import { PokemonDetails } from '../types/pokemon';

export function usePokemonSearch(data: PokemonDetails[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPokemon = useMemo(() => {
    if (!normalizedQuery) return data;

    return data.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(normalizedQuery);
      const idMatch = String(p.id).includes(normalizedQuery);

      return nameMatch || idMatch;
    });
  }, [data, normalizedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPokemon,
    normalizedQuery,
    displayCount: filteredPokemon.length,
    isSearching: normalizedQuery.length > 0,
  };
}
