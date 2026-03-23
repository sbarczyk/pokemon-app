export type Pokemon = {
  name: string;
  url: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};

export type PokemonTypesProps = {
  types: PokemonDetails['types'];
};
