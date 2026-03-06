import { Pokemon, PokemonDetails } from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(limit = 20, offset = 0): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
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
  return res.json();
}

export async function getPokemonDetailsById(id: number): Promise<PokemonDetails> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon details: ${res.statusText}`);
  }
  return res.json();
}
