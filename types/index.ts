export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  abilities: PokemonAbility[];
}

export interface PokemonListItem {
  id: any;
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonPower {
  pokemonId: number;
  powerLevel: number;
  steps: number;
  lastUpdated: string;
}

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {
    pokemon: Pokemon;
  };
};

export interface StepData {
  steps: number;
  distance?: number;
}

export const TYPE_COLORS: Record<string, string[]> = {
  normal: ["#A8A878", "#C6C6A7"],
  fire: ["#F08030", "#F5AC78"],
  water: ["#6890F0", "#9DB7F5"],
  electric: ["#F8D030", "#FAE078"],
  grass: ["#78C850", "#A7DB8D"],
  ice: ["#98D8D8", "#BCE6E6"],
  fighting: ["#C03028", "#D67873"],
  poison: ["#A040A0", "#C183C1"],
  ground: ["#E0C068", "#EBD69D"],
  flying: ["#A890F0", "#C6B7F5"],
  psychic: ["#F85888", "#FA92B2"],
  bug: ["#A8B820", "#C6D16E"],
  rock: ["#B8A038", "#D1C17D"],
  ghost: ["#705898", "#A292BC"],
  dragon: ["#7038F8", "#A27DFA"],
  dark: ["#705848", "#A29288"],
  steel: ["#B8B8D0", "#D1D1E0"],
  fairy: ["#EE99AC", "#F4BDC9"],
};
