import { PokemonDetails } from "../types/pokemon";

export const getPokemonImageUrl = (pokemonDetails: PokemonDetails) => {
  return (
    pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ??
    pokemonDetails?.sprites?.front_default ??
    ''
  );
};