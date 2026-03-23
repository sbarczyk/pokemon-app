import { PokemonDetails } from "../types/pokemon";

export const getPokemonImageUrl = (pokemonDetails: PokemonDetails) => {
  return (
    pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ??
    pokemonDetails?.sprites?.front_default ??
    ''
  );
};

/** Mapa (iOS / custom View): preferuj `front_default`; fallback na artwork dla starych pinów. */
export const getPokemonMapMarkerImageUrl = (pokemonDetails: PokemonDetails) => {
  return (
    pokemonDetails?.sprites?.front_default ??
    pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ??
    ''
  );
};

/** Placeholder na Androidzie zanim zakończy się `expo-image-manipulator` — mały sprite (~96px). */
export const getPokemonMapMarkerNativeImageUrl = (pokemonDetails: PokemonDetails) => {
  return pokemonDetails?.sprites?.front_default ?? '';
};