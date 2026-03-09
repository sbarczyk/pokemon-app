export const getPokemonImageUrl = (pokemonDetails: any) => {
    return pokemonDetails?.sprites?.other?.['official-artwork']?.front_default 
        ?? pokemonDetails?.sprites?.front_default 
        ?? '';
  };