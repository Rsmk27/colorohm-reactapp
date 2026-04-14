import { View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Line, LinearGradient, Rect, Stop } from 'react-native-svg';
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

  return (
    <AnimatedRect
      animatedProps={animatedProps}
      x={x}
      y={61}
      width={width}
      height={66}
      rx={1.5}
      stroke="rgba(0,0,0,0.42)"
      strokeWidth={0.6}
    />
  );
}

type ResistorVisualProps = {
  bands: BandColorKey[];
  bandCount: 3 | 4 | 5 | 6;
};

export function ResistorVisual({ bands, bandCount }: ResistorVisualProps) {
  const active = useMemo(() => bands.slice(0, bandCount), [bands, bandCount]);

  const bandLayout = useMemo(() => {
    if (bandCount === 3) {
      return [229, 259, 289].map((x) => ({ x, width: 10 }));
    }

    if (bandCount === 4) {
      return [223, 247, 273, 309].map((x, index) => ({ x, width: index === 3 ? 8 : 9 }));
    }

    if (bandCount === 5) {
      return [218, 238, 258, 280, 312].map((x, index) => ({ x, width: index >= 3 ? 8 : 8 }));
    }

    return [213, 231, 249, 271, 297, 315].map((x, index) => ({
      x,
      width: index >= 4 ? 7 : 7,
    }));
  }, [bandCount]);

  return (
    <View className="w-full items-center rounded-3xl border border-border bg-surface p-4">
      <Svg width="100%" height={190} viewBox="0 0 520 190">
        <Defs>
          <LinearGradient id="leadTone" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#79818D" />
            <Stop offset="0.48" stopColor="#D2D7DF" />
            <Stop offset="1" stopColor="#79818D" />
          </LinearGradient>
          <LinearGradient id="ceramicTone" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F0D6C0" />
            <Stop offset="0.5" stopColor="#D8AD8F" />
            <Stop offset="1" stopColor="#B98468" />
          </LinearGradient>
          <ClipPath id="bodyClip">
            <Rect x="178" y="58" width="164" height="72" rx="32" />
          </ClipPath>
        </Defs>

        <Ellipse cx="260" cy="144" rx="128" ry="11" fill="rgba(0,0,0,0.36)" />

        <Line x1="0" y1="95" x2="178" y2="95" stroke="url(#leadTone)" strokeWidth="6" strokeLinecap="round" />
        <Line x1="342" y1="95" x2="520" y2="95" stroke="url(#leadTone)" strokeWidth="6" strokeLinecap="round" />
        <Line x1="0" y1="92.8" x2="178" y2="92.8" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" strokeLinecap="round" />
        <Line x1="342" y1="92.8" x2="520" y2="92.8" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" strokeLinecap="round" />

        <Rect x="170" y="82" width="12" height="26" rx="4" fill="url(#leadTone)" />
        <Rect x="338" y="82" width="12" height="26" rx="4" fill="url(#leadTone)" />

        <Rect x="178" y="58" width="164" height="72" rx="32" fill="#D8AE8A" />
        <Rect x="178" y="58" width="164" height="72" rx="32" fill="url(#ceramicTone)" />
        <Rect x="178" y="58" width="164" height="18" rx="9" fill="#F4DFCF" />
        <Rect x="178" y="112" width="164" height="14" rx="7" fill="rgba(96,61,30,0.22)" />
        <Rect x="178" y="58" width="164" height="72" rx="32" fill="none" stroke="#8B5B3F" strokeWidth="1.9" />

        <Rect x="178" y="58" width="10" height="72" rx="4" fill="#906646" />
        <Rect x="332" y="58" width="10" height="72" rx="4" fill="#906646" />

        <G clipPath="url(#bodyClip)">
          {active.map((band, idx) => {
            const color = bandColors[band]?.hex ?? 'transparent';
            const renderedColor = band === 'none' ? '#00000000' : color;
            return (
              <Stripe
                key={`${idx}-${band}`}
                x={bandLayout[idx]?.x ?? 220 + idx * 16}
                width={bandLayout[idx]?.width ?? 7}
                color={renderedColor}
              />
            );
          })}
        </G>

        <Rect x="178" y="58" width="164" height="72" rx="32" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
      </Svg>
    </View>
  );
}
