import { PokemonDetails } from './pokemon';

export type PokemonCardProps = {
  pokemon: PokemonDetails;
  onPress?: (pokemon: PokemonDetails) => void;
  isFavorite?: boolean;
};
