import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { typography } from '../constants/theme';

function CircuitNode({ cx, cy, delay }: { cx: string; cy: string; delay: number }) {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }, delay * 200);
  }, [delay, opacity, scale]);

  const animatedProps = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: parseInt(cx) - 4, top: parseInt(cy) - 4 }, animatedProps]}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00D4FF', shadowColor: '#00D4FF', shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }} />
    </Animated.View>
  );
}

export default function EasterEggScreen() {
  const router = useRouter();

  const enteringAnim = () => {
    'worklet';
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.8 }],
      },
      animations: {
        opacity: withTiming(1, { duration: 400 }),
        transform: [{ scale: withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) }) }],
      },
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={enteringAnim} style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EAEAEA" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.center}>
          <View style={{ width: 200, height: 200, position: 'relative' }}>
            <Svg height="200" width="200" viewBox="0 0 200 200">
              <Path
                d="M 50 150 L 50 100 L 100 100 L 100 50 L 150 50"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="2"
                opacity="0.5"
              />
              <Path
                d="M 20 180 L 180 20"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="1"
                opacity="0.2"
                strokeDasharray="4 4"
              />
              <Path
                d="M 150 150 L 100 150 L 100 180"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="2"
                opacity="0.5"
              />
            </Svg>
            
            <CircuitNode cx="50" cy="150" delay={0} />
            <CircuitNode cx="50" cy="100" delay={1} />
            <CircuitNode cx="100" cy="100" delay={2} />
            <CircuitNode cx="100" cy="50" delay={3} />
            <CircuitNode cx="150" cy="50" delay={4} />
            <CircuitNode cx="150" cy="150" delay={5} />
            <CircuitNode cx="100" cy="180" delay={6} />
          </View>

          <Text style={styles.title}>Made with ☕ by RSMK</Text>
          <Text style={styles.subtitle}>ColorOhm v1.2.1 — rsmk.me</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E11',
  },
  content: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  title: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
  },
  subtitle: {
    fontFamily: typography.mono,
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
  },
});
