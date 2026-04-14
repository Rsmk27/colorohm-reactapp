import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Share, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { FadeIn, FadeOut, FadeInLeft, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { BandCountToggle } from '../../components/BandCountToggle';
import { BandSelector } from '../../components/BandSelector';
import { ColorSwatch } from '../../components/ColorSwatch';
import { ResistorVisual } from '../../components/ResistorVisual';
import { ResultCard } from '../../components/ResultCard';
import { AppBrandHeader } from '../../components/AppBrandHeader';
import { EasterEggToast } from '../../components/EasterEggToast';
import { StarBurst } from '../../components/StarBurst';
import {
  bandOptionsForPosition,
  BandColorKey,
  defaultBandsByCount,
} from '../../constants/bandData';
import { decodeResistor, BandCount } from '../../utils/resistorCalc';
import { formatResistance } from '../../utils/formatResistance';
import { onSuccess, onError, onSelect, onFavorite } from '../../utils/haptics';
import { addHistory, addFavorite, removeFavorite, isFavorited, FavoriteEntry } from '../../utils/storage';

const BAND_LABELS = ['Digit 1', 'Digit 2', 'Digit 3', 'Multiplier', 'Tolerance', 'PPM'];

export default function DecodeScreen() {
  const [bandCount, setBandCount] = useState<BandCount>(4);
  const [bands, setBands] = useState<BandColorKey[]>(defaultBandsByCount[4]);
  const [selectedBandIndex, setSelectedBandIndex] = useState<number>(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [favEntry, setFavEntry] = useState<FavoriteEntry | null>(null);
  const [eggState, setEggState] = useState({ visible: false, message: '', color: '' });
  const [showBurst, setShowBurst] = useState(false);
  const hideEggTimer = useRef<NodeJS.Timeout | null>(null);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const sheetRef = useRef<BottomSheetModal>(null);

  const error = useMemo(() => {
    const activeBands = bands.slice(0, bandCount);
    if (activeBands.some((band) => band === 'none')) {
      return null;
    }

    if ((activeBands[0] ?? 'none') === 'black') {
      return 'First significant band cannot be black.';
    }

    return null;
  }, [bands, bandCount]);

  const result = useMemo(() => {
    try {
      if (error) {
        return null;
      }
      return decodeResistor(bands, bandCount);
    } catch {
      return null;
    }
  }, [bands, bandCount, error]);

  const activeBands = useMemo(() => bands.slice(0, bandCount), [bands, bandCount]);

  const inputSummary = useMemo(() => {
    return `${bandCount}-band: ${activeBands.join(', ')}`;
  }, [activeBands, bandCount]);

  const resultStr = useMemo(() => {
    if (!result) return '';
    const tol = result.tolerance !== null ? ` ±${result.tolerance}%` : '';
    return `${formatResistance(result.value)}${tol}`;
  }, [result]);

  // Check favorite state when result changes
  useFocusEffect(
    useCallback(() => {
      if (resultStr) {
        isFavorited(inputSummary, resultStr).then(setFavEntry);
      } else {
        setFavEntry(null);
      }
    }, [inputSummary, resultStr])
  );

  // Write to history on successful decode
  useMemo(() => {
    if (result && resultStr) {
      addHistory({ type: 'color_band', input: inputSummary, result: resultStr });
      isFavorited(inputSummary, resultStr).then(setFavEntry);
      
      let doEgg = false;
      let msg = '';
      let color = '';
      if (result.value === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        msg = "That's just a wire bro \uD83D\uDC80"; color = '#EF4444'; doEgg = true;
      } else if (result.value === 42) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        msg = "The answer to everything \uD83C\uDF0C"; color = '#8B5CF6'; doEgg = true;
      } else if (result.value === 69) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        msg = "Nice. \uD83D\uDE0F"; color = '#10B981'; doEgg = true;
      } else if (result.value >= 999000000) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        msg = "Basically open circuit \uD83D\uDC7B"; color = '#9CA3AF'; doEgg = true;
      }

      if (doEgg) {
        setEggState({ visible: true, message: msg, color });
        if (hideEggTimer.current) clearTimeout(hideEggTimer.current);
        hideEggTimer.current = setTimeout(() => {
          setEggState(prev => ({ ...prev, visible: false }));
        }, 2500);
      } else {
        setEggState(prev => ({ ...prev, visible: false }));
      }
    } else {
        setEggState(prev => ({ ...prev, visible: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultStr]);

  const openSheet = (index: number) => {
    setSelectedBandIndex(index);
    sheetRef.current?.present();
  };

  const onBandCountChange = (next: BandCount) => {
    setBandCount(next);
    setBands((prev) => {
      const defaults = defaultBandsByCount[next];
      const merged = [...defaults];
      for (let i = 0; i < next; i += 1) {
        if (prev[i]) {
          merged[i] = prev[i];
        }
      }
      return merged;
    });
  };

  const onColorPick = async (color: BandColorKey) => {
    await onSelect();
    setBands((prev) => {
      const copy = [...prev];
      copy[selectedBandIndex] = color;
      return copy;
    });
  };

  const onCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(formatResistance(result.value));
    await onSuccess();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1300);
  };

  const handleToggleFavorite = async () => {
    if (!result || !resultStr) return;
    await onFavorite();
    if (favEntry) {
      await removeFavorite(favEntry.id);
      setFavEntry(null);
    } else {
      const entry = await addFavorite({ type: 'color_band', input: inputSummary, result: resultStr });
      setFavEntry(entry);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 500);
    }
  };

  const handleShare = async () => {
    if (!result || !resultStr) return;
    try {
      await Share.share({
        message: `ColorOhm Result\n${inputSummary} → ${resultStr}\nDecoded with ColorOhm by RSMK\nhttps://colorohm.rsmk.me`,
      });
    } catch {
      // user cancelled
    }
  };

  const options = bandOptionsForPosition(bandCount, selectedBandIndex);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AppBrandHeader subtitle="Decode resistor color bands into precise resistance values." pulseOnMount />

        <BandCountToggle value={bandCount} onChange={onBandCountChange} />

        <ResistorVisual bands={activeBands} bandCount={bandCount} />

        <Animated.View
          layout={Layout.springify()}
          className={`gap-3 ${isLandscape ? 'flex-row flex-wrap' : 'flex-row flex-wrap justify-between'}`}
        >
          {activeBands.map((band, index) => (
            <Animated.View
              key={`${index}-${bandCount}`}
              entering={result ? FadeInLeft.delay(index * 80).duration(180) : FadeInLeft.duration(180)}
              exiting={FadeOut.duration(120)}
              layout={Layout.springify()}
            >
              <BandSelector
                index={index}
                value={band}
                label={BAND_LABELS[index]}
                labelDelay={bandCount * 80 + 100}
                onPress={openSheet}
              />
            </Animated.View>
          ))}
        </Animated.View>

        <ResultCard result={result} error={error} onCopy={onCopy} />

        {/* Star + Share row */}
        {result ? (
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleToggleFavorite}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 relative"
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
                {favEntry ? 'Saved' : 'Favorite'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <Ionicons name="share-outline" size={18} color="#EAEAEA" />
              <Text style={{ color: '#EAEAEA' }} className="font-semibold">Share</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {toastVisible ? (
        <View className="absolute bottom-28 self-center rounded-xl bg-surface px-4 py-2">
          <Text style={{ color: '#EAEAEA' }}>Copied!</Text>
        </View>
      ) : null}

      <EasterEggToast
        message={eggState.message}
        accentColor={eggState.color}
        visible={eggState.visible}
      />

      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={['50%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
        )}
        backgroundStyle={{ backgroundColor: '#18181D' }}
        handleIndicatorStyle={{ backgroundColor: '#666' }}
        enablePanDownToClose
      >
        <BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text className="mb-3 text-center text-base font-semibold" style={{ color: '#EAEAEA' }}>
            Select {BAND_LABELS[selectedBandIndex]}
          </Text>
          <View className="flex-row flex-wrap justify-center gap-3">
            {options.map((color) => (
              <ColorSwatch
                key={`${selectedBandIndex}-${color}`}
                color={color}
                selected={bands[selectedBandIndex] === color}
                onPress={onColorPick}
              />
            ))}
          </View>
          <Pressable onPress={() => sheetRef.current?.dismiss()} className="mt-4 rounded-xl bg-card px-4 py-3 border border-border">
            <Text className="text-center font-semibold" style={{ color: '#EAEAEA' }}>Done</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
