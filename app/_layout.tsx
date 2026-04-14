import 'react-native-gesture-handler';
import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { EasterEggToast } from '../components/EasterEggToast';
import { useShakeDetector } from '../utils/useShakeDetector';
import { getRandomE24 } from '../utils/e24Series';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function RootLayout() {
  useFonts({
    JetBrainsMono_500Medium,
  });

  const [shakeResistor, setShakeResistor] = useState('');
  const [showShakeToast, setShowShakeToast] = useState(false);

  useShakeDetector(() => {
    const value = getRandomE24();
    setShakeResistor(value);
    setShowShakeToast(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => setShowShakeToast(false), 2500);
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0E0E11' }, animation: 'fade' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="EasterEgg" />
        </Stack>
        <EasterEggToast
          message={`Resistor of the Day: ${shakeResistor}`}
          accentColor="#10B981"
          visible={showShakeToast}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
