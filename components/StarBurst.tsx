import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function StarBurst({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" className="items-center justify-center">
      {[0, 60, 120, 180, 240, 300].map((angle, index) => (
        <Particle key={index} angle={angle} />
      ))}
    </View>
  );
}

function Particle({ angle }: { angle: number }) {
  const distance = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    distance.value = withTiming(30, { duration: 400, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) });
  }, [distance, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * distance.value;
    const y = Math.sin(rad) * distance.value;
    return {
      transform: [
        { translateX: x },
        { translateY: y },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.particle, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
});
