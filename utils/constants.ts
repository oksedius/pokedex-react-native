export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEMON_LIMIT = 151;
export const STEPS_PER_LEVEL = 100;
export const STEP_UPDATE_INTERVAL = 100;

export const STORAGE_KEYS = {
  POKEMON_POWER_PREFIX: "pokemon_power_",
  TOTAL_STEPS: "total_steps",
  USER_SETTINGS: "user_settings",
  FAVORITE_POKEMON: "favorite_pokemon",
} as const;

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

export const COLORS = {
  primary: "#EF5350",
  secondary: "#FF7043",
  background: "#f5f5f5",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#666666",
  lightGray: "#E0E0E0",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
};

export const LAYOUT = {
  padding: 16,
  borderRadius: 16,
  cardPadding: 12,
};

export const ANIMATION = {
  short: 200,
  medium: 300,
  long: 500,
  powerUp: 2000,
};
