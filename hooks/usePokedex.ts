import { useEffect, useMemo, useRef, useState } from "react";

import { PokemonDetails } from "../types/pokemon";
import { getPokemonList, getPokemonDetails } from "../services/pokeapi";
import {
  getFavoritePokemon,
  saveFavoritePokemon,
  removeFavoritePokemon,
} from "../services/favoritePokemon";

const PAGE_LIMIT = 20;

export function usePokedex() {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [offset, setOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadingRef = useRef(false);
  const loadedOffsetsRef = useRef<Set<number>>(new Set());
  const seenPokemonIdsRef = useRef<Set<number>>(new Set());

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPokemon = useMemo(() => {
    if (!normalizedQuery) return pokemon;
    return pokemon.filter((p) => p.name.toLowerCase().includes(normalizedQuery));
  }, [pokemon, normalizedQuery]);

  const displayCount = filteredPokemon.length;

  useEffect(() => {
    getFavoritePokemon()
      .then(setFavoritePokemon)
      .catch(() => setFavoritePokemon(null));
  }, []);

  useEffect(() => {
    void loadPokemon();
  }, [offset]);

  async function setFavorite(pokemonToFavorite: PokemonDetails) {
    setFavoritePokemon(pokemonToFavorite);
    await saveFavoritePokemon(pokemonToFavorite);
  }

  async function clearFavorite() {
    setFavoritePokemon(null);
    await removeFavoritePokemon();
  }

  async function loadPokemon() {
    if (loadingRef.current || isRefreshing || !hasMore) return;
    if (loadedOffsetsRef.current.has(offset)) return;

    loadingRef.current = true;
    loadedOffsetsRef.current.add(offset);
    setIsLoadingMore(true);

    try {
      const list = await getPokemonList(PAGE_LIMIT, offset);
      if (list.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      const details = await Promise.all(list.map((p) => getPokemonDetails(p.url)));

      setPokemon((prev) => {
        if (offset === 0) {
          seenPokemonIdsRef.current.clear();
        }

        const next = offset === 0 ? [] : [...prev];
        for (const p of details) {
          if (!seenPokemonIdsRef.current.has(p.id)) {
            seenPokemonIdsRef.current.add(p.id);
            next.push(p);
          }
        }
        return next;
      });
    } catch {
      loadedOffsetsRef.current.delete(offset);
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }

  async function refreshPokemon() {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsRefreshing(true);

    try {
      const targetCount = Math.max(pokemon.length, PAGE_LIMIT);
      const list = await getPokemonList(targetCount, 0);
      const details = await Promise.all(list.map((p) => getPokemonDetails(p.url)));

      const byId = new Map<number, PokemonDetails>();
      for (const p of details) {
        if (!byId.has(p.id)) {
          byId.set(p.id, p);
        }
      }
      const uniqueDetails = Array.from(byId.values());

      setPokemon(uniqueDetails);
      seenPokemonIdsRef.current = new Set(uniqueDetails.map((p) => p.id));

      const loadedOffsets = new Set<number>();
      for (let pageOffset = 0; pageOffset < uniqueDetails.length; pageOffset += PAGE_LIMIT) {
        loadedOffsets.add(pageOffset);
      }
      loadedOffsetsRef.current = loadedOffsets;
      setHasMore(list.length === targetCount);
    } finally {
      setIsRefreshing(false);
      loadingRef.current = false;
    }
  }

  function loadMorePokemon() {
    if (!isLoadingMore && !normalizedQuery && pokemon.length > 0 && hasMore) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  }

  return {
    favoritePokemon,
    searchQuery,
    setSearchQuery,
    filteredPokemon,
    displayCount,
    isRefreshing,
    setFavorite,
    clearFavorite,
    refreshPokemon,
    loadMorePokemon,
  };
}
