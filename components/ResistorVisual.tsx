import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo, useRef } from 'react';

import { BandColorKey, bandColors } from '../constants/bandData';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type StripeProps = {
  x: number;
  width: number;
  color: string;
};

function Stripe({ x, width, color }: StripeProps) {
  const progress = useSharedValue(1);
  const prevColor = useRef(color);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 300 });
    prevColor.current = color;
  }, [color, progress]);

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], [prevColor.current, color]),
  }));

  return <AnimatedRect animatedProps={animatedProps} x={x} y={35} width={width} height={90} rx={3} />;
}

type ResistorVisualProps = {
  bands: BandColorKey[];
  bandCount: 3 | 4 | 5 | 6;
};

export function ResistorVisual({ bands, bandCount }: ResistorVisualProps) {
  const active = useMemo(() => bands.slice(0, bandCount), [bands, bandCount]);
  const startX = 135;
  const spacing = 24;

  return (
    <View className="w-full items-center rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      <Svg width="100%" height={160} viewBox="0 0 400 160">
        <Line x1="0" y1="80" x2="120" y2="80" stroke="#8A8A8A" strokeWidth="8" strokeLinecap="round" />
        <Line x1="280" y1="80" x2="400" y2="80" stroke="#8A8A8A" strokeWidth="8" strokeLinecap="round" />
        <Rect x="110" y="20" width="180" height="120" rx="50" fill="#E7D6A8" />
        <Rect x="110" y="20" width="180" height="120" rx="50" fill="rgba(255,255,255,0.1)" />

        {active.map((band, idx) => {
          const color = bandColors[band]?.hex ?? 'transparent';
          const renderedColor = band === 'none' ? '#00000000' : color;
          return <Stripe key={`${idx}-${band}`} x={startX + idx * spacing} width={14} color={renderedColor} />;
        })}
      </Svg>
    </View>
  );
}
