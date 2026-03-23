import { Pokemon, PokemonDetails } from '../types/pokemon';
import { normalizePokemonFromApi } from '../utils/normalizePokemonFromApi';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(
  limit = 20,
  offset = 0,
): Promise<Pokemon[]> {
  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon list: ${res.statusText}`);
  }

  return data.results;
}

export async function getPokemonDetails(url: string): Promise<PokemonDetails> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon details: ${res.statusText}`);
  }
  const raw = await res.json();
  return normalizePokemonFromApi(raw);
}

export async function getPokemonDetailsById(
  id: number,
): Promise<PokemonDetails> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon details: ${res.statusText}`);
  }
  const raw = await res.json();
  return normalizePokemonFromApi(raw);
}

export async function getAllPokemonNames(): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=10000`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon names: ${res.statusText}`);
  }
  return data.results;
}
