import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

type BandCount = 3 | 4 | 5 | 6;

type BandCountToggleProps = {
  value: BandCount;
  allowed?: BandCount[];
  onChange: (value: BandCount) => void;
};

export function BandCountToggle({ value, allowed = [3, 4, 5, 6], onChange }: BandCountToggleProps) {
  return (
    <View className="flex-row rounded-2xl border border-neutral-800 bg-neutral-950 p-1">
      {allowed.map((count) => {
        const selected = count === value;
        return (
          <Pressable
            key={count}
            onPress={() => onChange(count)}
            className="flex-1 items-center justify-center overflow-hidden rounded-xl px-3 py-2"
          >
            {selected ? (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                layout={Layout.springify()}
                className="absolute inset-0 rounded-xl bg-amber-500/20"
              />
            ) : null}
            <Text className={`text-sm font-semibold ${selected ? 'text-amber-400' : 'text-neutral-400'}`}>
              {count} Bands
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
