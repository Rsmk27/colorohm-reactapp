import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ResistorResult } from '../utils/resistorCalc';
import { formatResistance } from '../utils/formatResistance';
import { typography } from '../constants/theme';

type ResultCardProps = {
  result: ResistorResult | null;
  error?: string | null;
  onCopy: () => void;
};

export function ResultCard({ result, error, onCopy }: ResultCardProps) {
  if (error) {
    return (
      <View className="rounded-2xl border border-red-500/50 bg-red-950/30 p-4">
        <Text className="text-sm text-red-300">{error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View className="rounded-2xl border border-border bg-surface p-4">
        <Text className="text-sm" style={{ color: '#9CA3AF' }}>Select all bands to calculate</Text>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      className="rounded-2xl border border-accent/40 bg-surface p-4"
      style={{
        shadowColor: '#00D4FF',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
      }}
    >
      <Text className="text-xs uppercase tracking-widest text-accent">Calculated Value</Text>
      <Text
        className="mt-2 text-4xl"
        style={{
          fontFamily: typography.mono,
          color: '#EAEAEA',
        }}
      >
        {formatResistance(result.value)}
      </Text>

      <View className="mt-4 gap-1">
        <Text style={{ color: '#FF9F1C' }}>Tolerance: {result.tolerance === null ? '--' : `±${result.tolerance}%`}</Text>
        <Text style={{ color: '#EAEAEA' }}>
          Min: {result.min === null ? '--' : formatResistance(result.min)} - Max:{' '}
          {result.max === null ? '--' : formatResistance(result.max)}
        </Text>
        {result.ppm !== null ? <Text style={{ color: '#EAEAEA' }}>Temp. Coeff: {result.ppm} ppm/K</Text> : null}
      </View>

      <Pressable onPress={onCopy} className="mt-4 rounded-xl bg-accent px-4 py-3">
        <Text className="text-center font-semibold" style={{ color: '#0E0E11' }}>Copy Value</Text>
      </Pressable>
    </Animated.View>
  );
}
