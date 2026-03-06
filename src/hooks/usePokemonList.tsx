import { useState, useEffect, useRef, useCallback } from "react";
import { PokemonDetails } from "../types/pokemon";
import { getPokemonList, getPokemonDetails } from "../services/pokeapi";

const PAGE_LIMIT = 20;

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [offset, setOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);
  const loadedOffsetsRef = useRef<Set<number>>(new Set());
  const seenPokemonIdsRef = useRef<Set<number>>(new Set());

  const loadPokemon = useCallback(async (currentOffset: number, shouldClear: boolean = false) => {
    if (loadingRef.current || (!shouldClear && !hasMore)) return;
    if (!shouldClear && loadedOffsetsRef.current.has(currentOffset)) return;

    loadingRef.current = true;
    
    if (shouldClear) {
      setIsRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const list = await getPokemonList(PAGE_LIMIT, currentOffset);
      
      if (list.length < PAGE_LIMIT) setHasMore(false);

      const details = await Promise.all(list.map((p) => getPokemonDetails(p.url)));

      if (shouldClear) {
        seenPokemonIdsRef.current.clear();
        loadedOffsetsRef.current.clear();
      }

      loadedOffsetsRef.current.add(currentOffset);

      setPokemon((prev) => {
        const base = shouldClear ? [] : prev;
        
        const uniqueNewDetails = details.filter((p) => {
          if (seenPokemonIdsRef.current.has(p.id)) return false;
          seenPokemonIdsRef.current.add(p.id);
          return true;
        });

        return [...base, ...uniqueNewDetails];
      });
      
      setOffset(currentOffset);
      
    } catch (e) {
      console.error("Failed to fetch pokemon:", e);
      if (!shouldClear) loadedOffsetsRef.current.delete(currentOffset);
    } finally {
      loadingRef.current = false;
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [hasMore]);

  useEffect(() => {
    loadPokemon(0, true);
  }, [loadPokemon]);

  const refreshPokemon = useCallback(async () => {
    setHasMore(true);
    await loadPokemon(0, true);
  }, [loadPokemon]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      loadPokemon(offset + PAGE_LIMIT, false);
    }
  }, [loadPokemon, offset, hasMore]);

  return {
    pokemon,
    isRefreshing,
    isLoadingMore,
    refreshPokemon,
    loadMore,
    hasMore,
  };
}