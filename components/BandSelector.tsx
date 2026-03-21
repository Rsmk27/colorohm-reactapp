import { Pressable, Text, View } from 'react-native';

import { bandColors, BandColorKey } from '../constants/bandData';

type BandSelectorProps = {
  index: number;
  value: BandColorKey;
  label: string;
  onPress: (index: number) => void;
};

export function BandSelector({ index, value, label, onPress }: BandSelectorProps) {
  const colorHex = value === 'none' ? 'transparent' : bandColors[value].hex;

  return (
    <View className="items-center gap-2">
      <Pressable
        onPress={() => onPress(index)}
        className="h-14 w-14 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-900"
        accessibilityRole="button"
        accessibilityLabel={`Band ${index + 1} selector ${value}`}
      >
        <View
          className="h-8 w-8 rounded-full border border-neutral-700"
          style={{ backgroundColor: colorHex }}
        />
      </Pressable>
      <Text className="text-xs text-neutral-400">{label}</Text>
    </View>
  );
}
