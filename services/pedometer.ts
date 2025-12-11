import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";

export const STEPS_PER_LEVEL = 100;

let stepCount = 0;
let lastPeakTime = 0;
let buffer: number[] = [];
let lastAvg = 0;

const PEAK_THRESHOLD = 1.15;
const MIN_STEP_DELAY = 300;

export const useGlobalSteps = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: any;

    const init = async () => {
      const saved = await AsyncStorage.getItem("totalSteps");
      if (saved) {
        stepCount = parseInt(saved, 10);
        setSteps(stepCount);
      }

      Accelerometer.setUpdateInterval(100);

      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        buffer.push(magnitude);
        if (buffer.length > 10) buffer.shift();

        // сглаживание (скользящее среднее)
        const avg = buffer.reduce((a, b) => a + b, 0) / buffer.length;

        // вычисляем адаптивный порог
        const dynamicThreshold = avg + (PEAK_THRESHOLD - 1);

        const now = Date.now();

        // если значение превысило порог — шаг
        if (magnitude > dynamicThreshold) {
          if (now - lastPeakTime > MIN_STEP_DELAY) {
            lastPeakTime = now;

            stepCount++;
            setSteps(stepCount);
            AsyncStorage.setItem("totalSteps", stepCount.toString());
          }
        }

        lastAvg = avg;
      });
    };

    init();

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    steps,
    powerLevel: Math.floor(steps / STEPS_PER_LEVEL),
    stepsToNext: STEPS_PER_LEVEL - (steps % STEPS_PER_LEVEL),
  };
};
