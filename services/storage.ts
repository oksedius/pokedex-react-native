import AsyncStorage from "@react-native-async-storage/async-storage";
import { PokemonPower } from "../types";

const STORAGE_KEYS = {
  POKEMON_POWER: "pokemon_power_",
  TOTAL_STEPS: "total_steps",
};

export const savePokemonPower = async (
  pokemonId: number,
  powerLevel: number,
  steps: number
): Promise<void> => {
  try {
    const data: PokemonPower = {
      pokemonId,
      powerLevel,
      steps,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      `${STORAGE_KEYS.POKEMON_POWER}${pokemonId}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Error saving pokemon power:", error);
  }
};

export const getPokemonPower = async (
  pokemonId: number
): Promise<PokemonPower | null> => {
  try {
    const data = await AsyncStorage.getItem(
      `${STORAGE_KEYS.POKEMON_POWER}${pokemonId}`
    );

    if (data) {
      return JSON.parse(data);
    }

    return null;
  } catch (error) {
    console.error("Error getting pokemon power:", error);
    return null;
  }
};

export const getAllPokemonPowers = async (): Promise<Record<
  number,
  PokemonPower
>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const powerKeys = keys.filter((key) =>
      key.startsWith(STORAGE_KEYS.POKEMON_POWER)
    );

    const powers: Record<number, PokemonPower> = {};

    for (const key of powerKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const power: PokemonPower = JSON.parse(data);
        powers[power.pokemonId] = power;
      }
    }

    return powers;
  } catch (error) {
    console.error("Error getting all pokemon powers:", error);
    return {};
  }
};

export const saveTotalSteps = async (steps: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_STEPS, steps.toString());
  } catch (error) {
    console.error("Error saving total steps:", error);
  }
};

export const getTotalSteps = async (): Promise<number> => {
  try {
    const steps = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_STEPS);
    return steps ? parseInt(steps, 10) : 0;
  } catch (error) {
    console.error("Error getting total steps:", error);
    return 0;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};
