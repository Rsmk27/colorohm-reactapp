import { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { BandCountToggle } from '../../components/BandCountToggle';
import { ResistorVisual } from '../../components/ResistorVisual';
import { encodeResistor } from '../../utils/encodeResistor';
import { formatResistance } from '../../utils/formatResistance';

const UNITS = ['Ω', 'kΩ', 'MΩ'] as const;
const TOLERANCES = [0.1, 0.25, 0.5, 1, 2, 5, 10] as const;

function unitMultiplier(unit: (typeof UNITS)[number]) {
  if (unit === 'kΩ') return 1_000;
  if (unit === 'MΩ') return 1_000_000;
  return 1;
}

export default function EncodeScreen() {
  const [valueText, setValueText] = useState('4.7');
  const [unit, setUnit] = useState<(typeof UNITS)[number]>('kΩ');
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [tolerance, setTolerance] = useState<(typeof TOLERANCES)[number]>(5);
  const [toast, setToast] = useState<string | null>(null);

  const ohms = useMemo(() => {
    const parsed = Number(valueText);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed * unitMultiplier(unit);
  }, [valueText, unit]);

  const encoded = useMemo(() => {
    if (!ohms) return null;
    return encodeResistor({ ohms, bandCount, tolerance });
  }, [ohms, bandCount, tolerance]);

  const resultText = useMemo(() => {
    if (!encoded) return null;
    return `${formatResistance(encoded.nearest)} | ${encoded.bands.join(' - ')} | ±${tolerance}%`;
  }, [encoded, tolerance]);

  const popToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const onCopy = async () => {
    if (!resultText) return;
    await Clipboard.setStringAsync(resultText);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    popToast('Copied!');
  };

  const onShare = async () => {
    if (!resultText) return;
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      popToast('Share unavailable on this device');
      return;
    }

    const fileUri = `${FileSystem.cacheDirectory}colorohm-share.txt`;
    await FileSystem.writeAsStringAsync(fileUri, resultText);
    await Sharing.shareAsync(fileUri, { mimeType: 'text/plain', dialogTitle: 'Share ColorOhm Result' });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View>
            <Text className="text-2xl font-bold text-neutral-100">Value Encode</Text>
            <Text className="text-neutral-400">Resistance value to color bands</Text>
          </View>

          <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <Text className="mb-2 text-neutral-300">Resistance Value</Text>
            <TextInput
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-lg text-neutral-100"
              keyboardType="numeric"
              value={valueText}
              onChangeText={setValueText}
              placeholder="e.g. 4.7"
              placeholderTextColor="#6B7280"
            />

            <View className="mt-3 flex-row gap-2">
              {UNITS.map((u) => (
                <Pressable
                  key={u}
                  onPress={() => setUnit(u)}
                  className={`flex-1 rounded-xl border px-3 py-2 ${
                    unit === u ? 'border-amber-500 bg-amber-500/20' : 'border-neutral-700 bg-neutral-900'
                  }`}
                >
                  <Text className={`text-center font-medium ${unit === u ? 'text-amber-400' : 'text-neutral-300'}`}>
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="mb-2 text-neutral-300">Band Count</Text>
            <BandCountToggle value={bandCount as 3 | 4 | 5 | 6} allowed={[4, 5]} onChange={(v) => setBandCount(v as 4 | 5)} />
          </View>

          <View>
            <Text className="mb-2 text-neutral-300">Tolerance</Text>
            <View className="flex-row flex-wrap gap-2">
              {TOLERANCES.map((tol) => (
                <Pressable
                  key={tol}
                  onPress={() => setTolerance(tol)}
                  className={`rounded-lg border px-3 py-2 ${
                    tolerance === tol ? 'border-amber-500 bg-amber-500/20' : 'border-neutral-700 bg-neutral-900'
                  }`}
                >
                  <Text className={tolerance === tol ? 'text-amber-400' : 'text-neutral-300'}>{tol}%</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {encoded ? (
            <View className="gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <ResistorVisual bands={encoded.bands} bandCount={bandCount} />
              <Text className="text-neutral-200">
                {encoded.exact ? 'Exact match' : `Nearest ${encoded.series} value used`}: {formatResistance(encoded.nearest)}
              </Text>
              <Text className="text-neutral-400 capitalize">{encoded.bands.join(' - ')}</Text>

              <View className="flex-row gap-2">
                <Pressable onPress={onCopy} className="flex-1 rounded-xl bg-amber-500 px-4 py-3">
                  <Text className="text-center font-semibold text-neutral-950">Copy</Text>
                </Pressable>
                <Pressable onPress={onShare} className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3">
                  <Text className="text-center font-semibold text-neutral-200">Share</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="rounded-2xl border border-red-500/40 bg-red-950/20 p-4">
              <Text className="text-red-300">Enter a valid value to encode</Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>

      {toast ? (
        <View className="absolute bottom-24 self-center rounded-xl bg-neutral-800 px-4 py-2">
          <Text className="text-neutral-100">{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
