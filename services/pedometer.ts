// src/services/pedometer.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";

// Ключ для хранения общего количества шагов за всё время
const TOTAL_STEPS_KEY = "pokemon_app_total_steps";

// 100 шагов = +1 уровень
export const STEPS_PER_LEVEL = 100;

export const calculatePowerLevel = (totalSteps: number): number => {
  return Math.floor(totalSteps / STEPS_PER_LEVEL);
};

export const getStepsToNextLevel = (totalSteps: number): number => {
  return STEPS_PER_LEVEL - (totalSteps % STEPS_PER_LEVEL);
};

// Хук — используй его в любом экране
export const useGlobalSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const init = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);

      if (!available) return;

      // Загружаем накопленные шаги
      const saved = await AsyncStorage.getItem(TOTAL_STEPS_KEY);
      const initialSteps = saved ? parseInt(saved, 10) : 0;
      setSteps(initialSteps);

      // Слушаем новые шаги
      subscription = Pedometer.watchStepCount((result) => {
        setSteps((prev) => {
          const newTotal = prev + result.steps; // result.steps === 1 при каждом шаге
          AsyncStorage.setItem(TOTAL_STEPS_KEY, newTotal.toString());
          return newTotal;
        });
      });
    };

    init();

    return () => {
      subscription?.remove();
    };
  }, []);

  const powerLevel = calculatePowerLevel(steps);
  const stepsToNext = getStepsToNextLevel(steps);

  return { steps, powerLevel, stepsToNext, isAvailable };
};
