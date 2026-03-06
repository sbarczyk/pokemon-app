import React, { createContext, useContext, useState, useEffect } from 'react';
import { PokemonDetails } from '../types/pokemon';
import * as favoriteService from '../services/favoritePokemon';
import { FavoriteContextType } from '../types/favoritePokemon';

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorite, setFavorite] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    favoriteService.getFavoritePokemon().then((data) => {
      setFavorite(data);
      setIsLoading(false);
    });
  }, []);

  const toggleFavorite = async (pokemon: PokemonDetails) => {
    if (favorite?.id === pokemon.id) {
      await favoriteService.removeFavoritePokemon();
      setFavorite(null);
    } else {
      await favoriteService.saveFavoritePokemon(pokemon);
      setFavorite(pokemon);
    }
  };

  const clearFavorite = async () => {
    await favoriteService.removeFavoritePokemon();
    setFavorite(null);
  };

  return (
    <FavoriteContext.Provider
      value={{ favorite, toggleFavorite, clearFavorite, isLoading }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context)
    throw new Error('useFavorites must be used within FavoriteProvider');
  return context;
};
