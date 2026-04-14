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
        selected ? 'border-accent bg-card' : 'border-border bg-surface'
      }`}
    >
      <View
        className="h-10 w-10 rounded-full border border-neutral-600"
        style={{ backgroundColor: color === 'none' ? 'transparent' : hex }}
      />
      <Text className="text-xs capitalize" style={{ color: '#EAEAEA' }}>{color}</Text>
    </Pressable>
  );
}
