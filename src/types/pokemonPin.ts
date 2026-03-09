import { PokemonDetails } from "./pokemon";

export interface PokemonPin {
    id: number;
    latitude: number;
    longitude: number;
    pokemonDetails: PokemonDetails;
}

export default PokemonPin;