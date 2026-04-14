import { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

import { BandCountToggle } from '../../components/BandCountToggle';
import { AppBrandHeader } from '../../components/AppBrandHeader';
import { ResistorVisual } from '../../components/ResistorVisual';
import { encodeResistor } from '../../utils/encodeResistor';
import { formatResistance } from '../../utils/formatResistance';
import { onSuccess, onError, onFavorite } from '../../utils/haptics';
import { addHistory, addFavorite, removeFavorite, isFavorited, FavoriteEntry } from '../../utils/storage';

const UNITS = ['Ω', 'kΩ', 'MΩ'] as const;
const TOLERANCES = [0.1, 0.25, 0.5, 1, 2, 5, 10] as const;
const TEMP_COEFFICIENTS = [1, 5, 10, 15, 20, 25, 50, 100, 250] as const;

function unitMultiplier(unit: (typeof UNITS)[number]) {
  if (unit === 'kΩ') return 1_000;
  if (unit === 'MΩ') return 1_000_000;
  return 1;
}

export default function EncodeScreen() {
  const [valueText, setValueText] = useState('4.7');
  const [unit, setUnit] = useState<(typeof UNITS)[number]>('kΩ');
  const [bandCount, setBandCount] = useState<3 | 4 | 5 | 6>(4);
  const [tolerance, setTolerance] = useState<(typeof TOLERANCES)[number]>(5);
  const [ppm, setPpm] = useState<(typeof TEMP_COEFFICIENTS)[number]>(100);
  const [toast, setToast] = useState<string | null>(null);
  const [favEntry, setFavEntry] = useState<FavoriteEntry | null>(null);
  const [lastHistoryResult, setLastHistoryResult] = useState<string>('');

  const ohms = useMemo(() => {
    const parsed = Number(valueText);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed * unitMultiplier(unit);
  }, [valueText, unit]);

  const encoded = useMemo(() => {
    if (!ohms) return null;
    return encodeResistor({
      ohms,
      bandCount,
      tolerance,
      ppm: bandCount === 6 ? ppm : null,
    });
  }, [ohms, bandCount, tolerance, ppm]);

  const inputSummary = useMemo(() => {
    return `${valueText}${unit}, ${bandCount}-band`;
  }, [valueText, unit, bandCount]);

  const resultStr = useMemo(() => {
    if (!encoded) return '';
    const ppmText = encoded.ppmUsed === null ? '' : ` | ${encoded.ppmUsed} ppm/K`;
    return `${formatResistance(encoded.nearest)} ±${encoded.toleranceUsed}%${ppmText}`;
  }, [encoded]);

  const resultText = useMemo(() => {
    if (!encoded) return null;
    const ppmText = encoded.ppmUsed === null ? '' : ` | ${encoded.ppmUsed} ppm/K`;
    return `${formatResistance(encoded.nearest)} | ${encoded.bands.join(' - ')} | ±${encoded.toleranceUsed}%${ppmText}`;
  }, [encoded]);

  // Write to history on new successful encode
  useMemo(() => {
    if (encoded && resultStr && resultStr !== lastHistoryResult) {
      addHistory({ type: 'encode', input: inputSummary, result: resultStr });
      setLastHistoryResult(resultStr);
      isFavorited(inputSummary, resultStr).then(setFavEntry);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultStr]);

  // Check favorite on focus
  useFocusEffect(
    useCallback(() => {
      if (resultStr) {
        isFavorited(inputSummary, resultStr).then(setFavEntry);
      }
    }, [inputSummary, resultStr])
  );

  const popToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const onCopy = async () => {
    if (!resultText) return;
    await Clipboard.setStringAsync(resultText);
    await onSuccess();
    popToast('Copied!');
  };

  const onShare = async () => {
    if (!resultText) return;
    try {
      await Share.share({
        message: `ColorOhm Result\n${inputSummary} → ${resultStr}\n${encoded?.bands.join(' - ')}\nDecoded with ColorOhm by RSMK`,
      });
    } catch {
      // user cancelled
    }
  };

  const handleToggleFavorite = async () => {
    if (!encoded || !resultStr) return;
    await onFavorite();
    if (favEntry) {
      await removeFavorite(favEntry.id);
      setFavEntry(null);
    } else {
      const entry = await addFavorite({ type: 'encode', input: inputSummary, result: resultStr });
      setFavEntry(entry);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          <AppBrandHeader subtitle="Encode resistance values into practical 3 to 6-band color codes." />

          <View className="self-start rounded-full border border-accent/40 px-3 py-1" style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
            <Text className="text-xs font-semibold uppercase tracking-wider text-accent">E24 or E96 auto-matching</Text>
          </View>

          <View className="rounded-3xl border border-border bg-surface p-4">
            <Text style={{ color: '#EAEAEA' }} className="mb-2">Resistance Value</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-3 text-lg"
              style={{ color: '#EAEAEA' }}
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
                    unit === u ? 'border-accent' : 'border-border bg-card'
                  }`}
                  style={unit === u ? { backgroundColor: 'rgba(0, 212, 255, 0.15)' } : undefined}
                >
                  <Text className={`text-center font-medium ${unit === u ? 'text-accent' : ''}`} style={unit !== u ? { color: '#EAEAEA' } : undefined}>
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text style={{ color: '#EAEAEA' }} className="mb-2">Band Count</Text>
            <BandCountToggle value={bandCount} allowed={[3, 4, 5, 6]} onChange={setBandCount} />
            <Text className="mt-2 text-xs" style={{ color: '#6B7280' }}>
              3-band: fixed ±20% tolerance | 6-band: includes temperature coefficient.
            </Text>
          </View>

          {bandCount === 3 ? (
            <View className="rounded-2xl border border-accent/30 p-4" style={{ backgroundColor: 'rgba(0, 212, 255, 0.08)' }}>
              <Text style={{ color: '#EAEAEA' }}>Tolerance for 3-band resistors is fixed at ±20% (no tolerance band).</Text>
            </View>
          ) : (
            <View>
              <Text style={{ color: '#EAEAEA' }} className="mb-2">Tolerance</Text>
              <View className="flex-row flex-wrap gap-2">
                {TOLERANCES.map((tol) => (
                  <Pressable
                    key={tol}
                    onPress={() => setTolerance(tol)}
                    className={`rounded-lg border px-3 py-2 ${
                      tolerance === tol ? 'border-accent' : 'border-border bg-card'
                    }`}
                    style={tolerance === tol ? { backgroundColor: 'rgba(0, 212, 255, 0.15)' } : undefined}
                  >
                    <Text style={tolerance === tol ? { color: '#00D4FF' } : { color: '#EAEAEA' }}>{tol}%</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {bandCount === 6 ? (
            <View>
              <Text style={{ color: '#EAEAEA' }} className="mb-2">Temperature Coefficient (ppm/K)</Text>
              <View className="flex-row flex-wrap gap-2">
                {TEMP_COEFFICIENTS.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPpm(p)}
                    className={`rounded-lg border px-3 py-2 ${
                      ppm === p ? 'border-accent' : 'border-border bg-card'
                    }`}
                    style={ppm === p ? { backgroundColor: 'rgba(0, 212, 255, 0.15)' } : undefined}
                  >
                    <Text style={ppm === p ? { color: '#00D4FF' } : { color: '#EAEAEA' }}>{p}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {encoded ? (
            <View
              className="gap-3 rounded-3xl border border-accent/30 bg-surface p-4"
              style={{
                shadowColor: '#00D4FF',
                shadowOpacity: 0.2,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 0 },
                elevation: 6,
              }}
            >
              <ResistorVisual bands={encoded.bands} bandCount={bandCount} />
              <Text style={{ color: '#EAEAEA' }}>
                {encoded.exact ? 'Exact match' : `Nearest ${encoded.series} value used`}: {formatResistance(encoded.nearest)}
              </Text>
              <Text className="capitalize" style={{ color: '#9CA3AF' }}>{encoded.bands.join(' - ')}</Text>
              <Text style={{ color: '#FF9F1C' }}>
                Tolerance: ±{encoded.toleranceUsed}%
                {encoded.ppmUsed === null ? '' : ` | Tempco: ${encoded.ppmUsed} ppm/K`}
              </Text>

              <View className="flex-row gap-2">
                <Pressable onPress={onCopy} className="flex-1 rounded-xl bg-accent px-4 py-3">
                  <Text className="text-center font-semibold" style={{ color: '#0E0E11' }}>Copy</Text>
                </Pressable>
                <Pressable onPress={onShare} className="flex-1 rounded-xl border border-border bg-card px-4 py-3">
                  <Text className="text-center font-semibold" style={{ color: '#EAEAEA' }}>Share</Text>
                </Pressable>
              </View>

              {/* Star + Share row */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleToggleFavorite}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <Ionicons
                    name={favEntry ? 'star' : 'star-outline'}
                    size={18}
                    color={favEntry ? '#FFD700' : '#9CA3AF'}
                  />
                  <Text style={{ color: favEntry ? '#FFD700' : '#EAEAEA' }} className="font-semibold">
                    {favEntry ? 'Saved' : 'Favorite'}
                  </Text>
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
        <View className="absolute bottom-24 self-center rounded-xl bg-surface px-4 py-2">
          <Text style={{ color: '#EAEAEA' }}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
