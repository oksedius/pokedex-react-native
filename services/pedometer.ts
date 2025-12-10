
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";


const TOTAL_STEPS_KEY = "pokemon_app_total_steps";

export const STEPS_PER_LEVEL = 100;

export const calculatePowerLevel = (totalSteps: number): number => {
  return Math.floor(totalSteps / STEPS_PER_LEVEL);
};

export const getStepsToNextLevel = (totalSteps: number): number => {
  return STEPS_PER_LEVEL - (totalSteps % STEPS_PER_LEVEL);
};


export const useGlobalSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const init = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);

      if (!available) return;

      const saved = await AsyncStorage.getItem(TOTAL_STEPS_KEY);
      const initialSteps = saved ? parseInt(saved, 10) : 0;
      setSteps(initialSteps);

  
      subscription = Pedometer.watchStepCount((result) => {
        setSteps((prev) => {
          const newTotal = prev + result.steps; 
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
