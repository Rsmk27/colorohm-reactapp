import { Pressable, Text, View } from 'react-native';

import { bandColors, BandColorKey } from '../constants/bandData';

type ColorSwatchProps = {
  color: BandColorKey;
  selected: boolean;
  onPress: (color: BandColorKey) => void;
};

export function ColorSwatch({ color, selected, onPress }: ColorSwatchProps) {
  const hex = bandColors[color].hex;

  return (
    <Pressable
      onPress={() => onPress(color)}
      accessibilityRole="button"
      accessibilityLabel={`${color} color swatch`}
      className={`w-20 items-center gap-2 rounded-xl border p-2 ${
        selected ? 'border-amber-400 bg-neutral-900' : 'border-neutral-800 bg-neutral-950'
      }`}
    >
      <View
        className="h-10 w-10 rounded-full border border-neutral-700"
        style={{ backgroundColor: color === 'none' ? 'transparent' : hex }}
      />
      <Text className="text-xs capitalize text-neutral-300">{color}</Text>
    </Pressable>
  );
}
