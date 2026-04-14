import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useShakeDetector(onShake: () => void) {
  const lastShake = useRef(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > 1.8) {
        const now = Date.now();
        if (now - lastShake.current > 2000) {
          lastShake.current = now;
          onShake();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onShake]);
}
