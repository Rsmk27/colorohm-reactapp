import { useCallback, useState } from 'react';
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
import Animated, { FadeInDown, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { AppBrandHeader } from '../../components/AppBrandHeader';
import { StarBurst } from '../../components/StarBurst';
import { decodeSMD, SMDDecodeResult } from '../../utils/smdDecode';
import { typography } from '../../constants/theme';
import { onSuccess, onError, onFavorite } from '../../utils/haptics';
import { addHistory, addFavorite, removeFavorite, isFavorited, FavoriteEntry } from '../../utils/storage';

export default function SMDDecoderScreen() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<SMDDecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [favEntry, setFavEntry] = useState<FavoriteEntry | null>(null);
  const [showBurst, setShowBurst] = useState(false);

  const springEntering = () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ scale: 0.9 }] },
      animations: {
        opacity: withTiming(1, { duration: 300 }),
        transform: [{ scale: withSpring(1) }],
      },
    };
  };

  const handleDecode = async () => {
    Keyboard.dismiss();

    const trimmed = code.trim();
    if (trimmed.length === 0) {
      setError('Please enter an SMD code.');
      setResult(null);
      setFavEntry(null);
      await onError();
      return;
    }

    const decoded = decodeSMD(trimmed);
    if (!decoded) {
      setError(`Unrecognized SMD code: "${trimmed}". Try a 3/4-digit code or R-notation (e.g. 472, 4702, 4R7).`);
      setResult(null);
      setFavEntry(null);
      await onError();
      return;
    }

    setResult(decoded);
    setError(null);
    await onSuccess();

    // Write to history
    const inputSummary = `SMD: ${trimmed}`;
    const resultStr = decoded.formatted;
    await addHistory({ type: 'smd', input: inputSummary, result: resultStr });

    // Check fav state
    const fav = await isFavorited(inputSummary, resultStr);
    setFavEntry(fav);
  };

  // Refresh fav state on focus
  useFocusEffect(
    useCallback(() => {
      if (result) {
        const inputSummary = `SMD: ${code.trim()}`;
        isFavorited(inputSummary, result.formatted).then(setFavEntry);
      }
    }, [result, code])
  );

  const popToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const onCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(result.formatted);
    await onSuccess();
    popToast('Copied!');
  };

  const handleToggleFavorite = async () => {
    if (!result) return;
    const inputSummary = `SMD: ${code.trim()}`;
    await onFavorite();
    if (favEntry) {
      await removeFavorite(favEntry.id);
      setFavEntry(null);
    } else {
      const entry = await addFavorite({ type: 'smd', input: inputSummary, result: result.formatted });
      setFavEntry(entry);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 500);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `ColorOhm Result\nSMD: ${code.trim()} → ${result.formatted}\n${result.explanation}\nDecoded with ColorOhm by RSMK\nhttps://colorohm.rsmk.me`,
      });
    } catch {
      // user cancelled
    }
  };

  const FORMAT_BADGE: Record<string, string> = {
    '3-digit': '3-Digit Code',
    '4-digit': '4-Digit Code',
    'R-notation': 'R-Notation',
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          <AppBrandHeader subtitle="Decode SMD resistor codes into resistance values." />

          {/* Input Card */}
          <View className="rounded-3xl border border-border bg-surface p-4">
            <Text style={{ color: '#EAEAEA' }} className="mb-2">SMD Code</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-3 text-lg"
              style={{ color: '#EAEAEA' }}
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setError(null);
              }}
              placeholder="e.g. 472, 4702, 4R7"
              placeholderTextColor="#6B7280"
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleDecode}
            />

            {/* Quick examples */}
            <View className="mt-3 flex-row flex-wrap gap-2">
              {['472', '4702', '4R7', 'R47', '103'].map((example) => (
                <Pressable
                  key={example}
                  onPress={() => {
                    setCode(example);
                    setError(null);
                  }}
                  className="rounded-lg border border-border bg-card px-3 py-1.5"
                >
                  <Text className="text-xs" style={{ color: '#9CA3AF' }}>{example}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleDecode}
              className="mt-4 rounded-xl bg-accent px-4 py-3"
            >
              <Text className="text-center font-semibold" style={{ color: '#0E0E11' }}>Decode</Text>
            </Pressable>
          </View>

          {/* Error State */}
          {error ? (
            <Animated.View
              entering={FadeInDown.duration(250)}
              className="rounded-2xl border border-red-500/50 bg-red-950/30 p-4"
            >
              <Text className="text-sm text-red-300">{error}</Text>
            </Animated.View>
          ) : null}

          {/* Result Card */}
          {result ? (
            <Animated.View
              entering={springEntering}
              className="rounded-2xl border border-accent/40 bg-surface p-4"
              style={{
                shadowColor: '#00D4FF',
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }}
            >
              {/* Format badge */}
              <View className="mb-3 self-start rounded-full border border-accent/40 px-3 py-1" style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
                <Text className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {FORMAT_BADGE[result.format]}
                </Text>
              </View>

              <Text className="text-xs uppercase tracking-widest text-accent">Resistance Value</Text>
              <Text
                className="mt-2 text-4xl"
                style={{ fontFamily: typography.mono, color: '#EAEAEA' }}
              >
                {result.formatted}
              </Text>

              <View className="mt-4 gap-2">
                {result.tolerance ? (
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full" style={{ backgroundColor: '#FF9F1C' }} />
                    <Text style={{ color: '#FF9F1C' }}>Tolerance: {result.tolerance}</Text>
                  </View>
                ) : null}

                <View className="mt-2 rounded-xl border border-border bg-card p-3">
                  <Text className="text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>How it Works</Text>
                  <Text className="mt-1 text-sm" style={{ color: '#EAEAEA' }}>{result.explanation}</Text>
                </View>
              </View>

              <View className="mt-4 flex-row gap-2">
                <Pressable onPress={onCopy} className="flex-1 rounded-xl bg-accent px-4 py-3">
                  <Text className="text-center font-semibold" style={{ color: '#0E0E11' }}>Copy Value</Text>
                </Pressable>
                <Pressable onPress={handleShare} className="flex-1 rounded-xl border border-border bg-card px-4 py-3">
                  <Ionicons name="share-outline" size={18} color="#EAEAEA" style={{ alignSelf: 'center' }} />
                </Pressable>
              </View>

              {/* Star row */}
              <Pressable
                onPress={handleToggleFavorite}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 relative"
              >
                <View className="relative">
                  <Ionicons
                    name={favEntry ? 'star' : 'star-outline'}
                    size={18}
                    color={favEntry ? '#FFD700' : '#9CA3AF'}
                  />
                  <StarBurst visible={showBurst} />
                </View>
                <Text style={{ color: favEntry ? '#FFD700' : '#EAEAEA' }} className="font-semibold">
                  {favEntry ? 'Saved to Favorites' : 'Add to Favorites'}
                </Text>
              </Pressable>
            </Animated.View>
          ) : null}

          {/* Info Card */}
          <View className="rounded-2xl border border-border bg-surface p-4">
            <Text className="mb-2 text-lg font-semibold" style={{ color: '#EAEAEA' }}>Supported Formats</Text>
            <View className="gap-3">
              <View>
                <Text className="font-semibold text-accent">3-Digit (e.g. 472)</Text>
                <Text className="text-sm" style={{ color: '#9CA3AF' }}>
                  First 2 digits are significant figures, 3rd is multiplier (10^n). Example: 472 = 47 × 10² = 4.7kΩ
                </Text>
              </View>
              <View>
                <Text className="font-semibold text-accent">4-Digit (e.g. 4702)</Text>
                <Text className="text-sm" style={{ color: '#9CA3AF' }}>
                  First 3 digits are significant figures, 4th is multiplier (10^n). Example: 4702 = 470 × 10² = 47kΩ
                </Text>
              </View>
              <View>
                <Text className="font-semibold text-accent">R-Notation (e.g. 4R7)</Text>
                <Text className="text-sm" style={{ color: '#9CA3AF' }}>
                  R replaces the decimal point. 4R7 = 4.7Ω, R47 = 0.47Ω, 47R = 47Ω
                </Text>
              </View>
            </View>
          </View>
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
