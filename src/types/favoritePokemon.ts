import { PokemonDetails } from "./pokemon";

export type FavoriteContextType = {
  favorite: PokemonDetails | null;
  toggleFavorite: (pokemon: PokemonDetails) => Promise<void>;
  clearFavorite: () => Promise<void>;
  isLoading: boolean;
};

export type FavoritePokemonBannerProps = {
  favoritePokemon: PokemonDetails | null;
  onRemove: () => void;
  onSeeDetails: () => void;
};
