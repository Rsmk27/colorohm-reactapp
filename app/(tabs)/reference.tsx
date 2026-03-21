import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBrandHeader } from '../../components/AppBrandHeader';
import { bandColors, BandColorKey } from '../../constants/bandData';

const ORDER: BandColorKey[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
  'gold',
  'silver',
];

const GUIDE = [
  {
    title: 'Reading Direction',
    body: 'Read from the side where bands are grouped closer together. The tolerance band is usually spaced farther from the main digits.',
  },
  {
    title: '4-band vs 5-band',
    body: '4-band resistors use two significant digits. 5-band resistors use three significant digits for tighter precision values.',
  },
  {
    title: 'Tolerance Meaning',
    body: 'Tolerance indicates the maximum expected variation around nominal resistance. Example: ±5% on 1kΩ means 950Ω to 1050Ω.',
  },
  {
    title: 'PPM/K (6-band)',
    body: 'Temperature coefficient (ppm/K) tells how much resistance changes per degree Kelvin as temperature shifts.',
  },
];

function Cell({ text, grow = false }: { text: string; grow?: boolean }) {
  return (
    <View className={`px-2 py-2 ${grow ? 'flex-1' : 'w-16'}`}>
      <Text className="text-xs text-neutral-300">{text}</Text>
    </View>
  );
}

export default function ReferenceScreen() {
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<number | null>(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} stickyHeaderIndices={[1]}>
        <AppBrandHeader subtitle="Color chart, mnemonics, and practical resistor reading tips." />

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-2">
          <View className="flex-row border-b border-neutral-700 bg-neutral-900 pb-2 pt-2">
            <Cell text="Color" grow />
            <Cell text="Digit" />
            <Cell text="Mult" />
            <Cell text="Tol" />
            <Cell text="PPM" />
          </View>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
          {loading
            ? ORDER.map((_, idx) => (
                <View key={`skeleton-${idx}`} className="mb-2 h-10 rounded-lg bg-neutral-900" />
              ))
            : ORDER.map((name, idx) => {
                const item = bandColors[name];
                return (
                  <View
                    key={name}
                    className={`mb-1 flex-row items-center rounded-lg ${idx % 2 === 0 ? 'bg-neutral-900/60' : 'bg-neutral-950'}`}
                  >
                    <View className="flex-1 flex-row items-center gap-2 px-2 py-2">
                      <View className="h-4 w-4 rounded-full border border-neutral-700" style={{ backgroundColor: item.hex }} />
                      <Text className="capitalize text-xs text-neutral-300">{name}</Text>
                    </View>
                    <Cell text={item.digit === null ? '-' : String(item.digit)} />
                    <Cell text={item.multiplier === null ? '-' : `x${item.multiplier}`} />
                    <Cell text={item.tolerance === null ? '-' : `${item.tolerance}%`} />
                    <Cell text={item.ppm === null ? '-' : String(item.ppm)} />
                  </View>
                );
              })}
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Text className="mb-2 text-lg font-semibold text-neutral-100">Mnemonic</Text>
          <View className="flex-row flex-wrap gap-1">
            {[
              ['B', 'black'],
              ['B', 'brown'],
              ['R', 'red'],
              ['O', 'orange'],
              ['Y', 'yellow'],
              ['G', 'green'],
              ['B', 'blue'],
              ['V', 'violet'],
              ['G', 'gray'],
              ['W', 'white'],
            ].map(([letter, key], idx) => (
              <View
                key={`${letter}-${idx}`}
                className="rounded-md px-2 py-1"
                style={{ backgroundColor: bandColors[key as BandColorKey].hex }}
              >
                <Text className={key === 'yellow' || key === 'white' ? 'text-neutral-900' : 'text-white'}>{letter}</Text>
              </View>
            ))}
          </View>
          <Text className="mt-2 text-neutral-400">B B ROY of Great Britain Very Good Wife</Text>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Text className="mb-2 text-lg font-semibold text-neutral-100">Reading Guide</Text>
          {GUIDE.map((item, index) => {
            const open = openSection === index;
            return (
              <View key={item.title} className="mb-2 overflow-hidden rounded-xl border border-neutral-800">
                <Pressable
                  onPress={() => setOpenSection(open ? null : index)}
                  className="flex-row items-center justify-between bg-neutral-900 px-3 py-3"
                >
                  <Text className="font-semibold text-neutral-200">{item.title}</Text>
                  <Text className="text-neutral-400">{open ? '-' : '+'}</Text>
                </Pressable>
                {open ? (
                  <View className="bg-neutral-950 px-3 py-3">
                    <Text className="text-neutral-300">{item.body}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
