import { Text, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

type AppBrandHeaderProps = {
  subtitle: string;
};

export function AppBrandHeader({ subtitle }: AppBrandHeaderProps) {
  return (
    <View className="rounded-3xl border border-neutral-800 bg-neutral-950 p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-neutral-900">
          <Svg width={44} height={44} viewBox="0 0 96 96">
            <Circle cx={48} cy={48} r={42} fill="#F59E0B" />
            <Circle cx={48} cy={48} r={29} fill="#111111" />
            <SvgText x={48} y={55} textAnchor="middle" fill="#F59E0B" fontSize={20} fontWeight="700">
              Ω
            </SvgText>
          </Svg>
        </View>

        <View className="flex-1">
          <Text className="text-2xl font-bold text-neutral-100">ColorOhm</Text>
          <Text className="text-xs uppercase tracking-wider text-amber-400">by RSMK</Text>
        </View>
      </View>

      <Text className="mt-3 text-neutral-400">{subtitle}</Text>
    </View>
  );
}
