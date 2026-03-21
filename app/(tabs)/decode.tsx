import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { BandCountToggle } from '../../components/BandCountToggle';
import { BandSelector } from '../../components/BandSelector';
import { ColorSwatch } from '../../components/ColorSwatch';
import { ResistorVisual } from '../../components/ResistorVisual';
import { ResultCard } from '../../components/ResultCard';
import { AppBrandHeader } from '../../components/AppBrandHeader';
import {
  bandOptionsForPosition,
  BandColorKey,
  defaultBandsByCount,
} from '../../constants/bandData';
import { decodeResistor, BandCount } from '../../utils/resistorCalc';
import { formatResistance } from '../../utils/formatResistance';

const BAND_LABELS = ['Digit 1', 'Digit 2', 'Digit 3', 'Multiplier', 'Tolerance', 'PPM'];

export default function DecodeScreen() {
  const [bandCount, setBandCount] = useState<BandCount>(4);
  const [bands, setBands] = useState<BandColorKey[]>(defaultBandsByCount[4]);
  const [selectedBandIndex, setSelectedBandIndex] = useState<number>(0);
  const [toastVisible, setToastVisible] = useState(false);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const sheetRef = useRef<BottomSheet>(null);

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

  const openSheet = (index: number) => {
    setSelectedBandIndex(index);
    sheetRef.current?.snapToIndex(0);
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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBands((prev) => {
      const copy = [...prev];
      copy[selectedBandIndex] = color;
      return copy;
    });
  };

  const onCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(formatResistance(result.value));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1300);
  };

  const options = bandOptionsForPosition(bandCount, selectedBandIndex);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AppBrandHeader subtitle="Decode resistor color bands into precise resistance values." />

        <BandCountToggle value={bandCount} onChange={onBandCountChange} />

        <ResistorVisual bands={activeBands} bandCount={bandCount} />

        <Animated.View
          layout={Layout.springify()}
          className={`gap-3 ${isLandscape ? 'flex-row flex-wrap' : 'flex-row flex-wrap justify-between'}`}
        >
          {activeBands.map((band, index) => (
            <Animated.View
              key={`${index}-${bandCount}`}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              layout={Layout.springify()}
            >
              <BandSelector
                index={index}
                value={band}
                label={BAND_LABELS[index]}
                onPress={openSheet}
              />
            </Animated.View>
          ))}
        </Animated.View>

        <ResultCard result={result} error={error} onCopy={onCopy} />
      </ScrollView>

      {toastVisible ? (
        <View className="absolute bottom-28 self-center rounded-xl bg-neutral-800 px-4 py-2">
          <Text className="text-neutral-100">Copied!</Text>
        </View>
      ) : null}

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['50%']}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
        backgroundStyle={{ backgroundColor: '#121212' }}
        handleIndicatorStyle={{ backgroundColor: '#666' }}
        enablePanDownToClose
      >
        <BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text className="mb-3 text-center text-base font-semibold text-neutral-100">
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
          <Pressable onPress={() => sheetRef.current?.close()} className="mt-4 rounded-xl bg-neutral-800 px-4 py-3">
            <Text className="text-center font-semibold text-neutral-100">Done</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
