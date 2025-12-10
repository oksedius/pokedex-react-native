// pokeApi.ts — ИСПРАВЛЕННАЯ ВЕРСИЯ (всё остальное оставь как есть)

import { Pokemon, PokemonListItem } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

// Работает — список
export const fetchPokemonList = async (
  limit: number = 151
): Promise<PokemonListItem[]> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch pokemon list");
  const data = await response.json();
  return data.results;
};

// Работает — по URL (всё ок, потому что url из results уже со слешем)
export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch pokemon details");
  return response.json();
};

// ИСПРАВЛЕНО — добавил слеш в конце!
export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`${BASE_URL}/pokemon/${id}/`); // ← ВОТ ТУТ БЫЛ СЛЕШ!

  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon ${id}`);
  }

  return response.json();
};

// Оставь как есть
export const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};
