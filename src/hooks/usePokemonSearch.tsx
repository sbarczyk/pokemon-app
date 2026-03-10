import { useState, useEffect, useRef } from 'react';
import { PokemonDetails } from '../types/pokemon';
import { getAllPokemonNames } from '../services/pokeapi';
import { getPokemonDetails } from '../services/pokeapi';

const MAX_SEARCH_RESULTS = 50;

export function useGlobalPokemonSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonDetails[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const fullListRef = useRef<{ name: string; url: string }[] | null>(null);
  const lastQueryRef = useRef('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  useEffect(() => {
    if (!normalizedQuery) {
      setFilteredPokemon([]);
      lastQueryRef.current = '';
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      lastQueryRef.current = normalizedQuery;
      setIsLoadingSearch(true);
      setFilteredPokemon([]);

      try {
        if (!fullListRef.current) {
          const list = await getAllPokemonNames();
          if (cancelled) return;
          fullListRef.current = list;
        }

        const list = fullListRef.current;
        const matches = list.filter((p) => {
          const urlParts = p.url.split('/').filter(Boolean);
          const id = urlParts[urlParts.length - 1] || '';
          const nameMatch = p.name.toLowerCase().includes(normalizedQuery);
          const idMatch = id.includes(normalizedQuery);
          return nameMatch || idMatch;
        });

        const toFetch = matches.slice(0, MAX_SEARCH_RESULTS);
        const details = await Promise.all(
          toFetch.map((p) => getPokemonDetails(p.url)),
        );

        if (cancelled || lastQueryRef.current !== normalizedQuery) return;
        setFilteredPokemon(details);
      } catch (e) {
        if (!cancelled) setFilteredPokemon([]);
        console.error('Search failed:', e);
      } finally {
        if (!cancelled) setIsLoadingSearch(false);
      }
    };

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [normalizedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPokemon,
    isSearching,
    isLoadingSearch,
  };
}
