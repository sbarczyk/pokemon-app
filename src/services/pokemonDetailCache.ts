import type { PokemonDetails } from '../types/pokemon';

let cached: PokemonDetails | null = null;

export function setCachedPokemonDetails(pokemon: PokemonDetails): void {
  cached = pokemon;
}

export function getCachedPokemonDetails(id: number): PokemonDetails | null {
  if (cached && cached.id === id) {
    const data = cached;
    cached = null;
    return data;
  }
  return null;
}
