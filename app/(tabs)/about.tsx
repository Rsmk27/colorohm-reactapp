import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="items-center rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          <Svg width={96} height={96} viewBox="0 0 96 96">
            <Circle cx={48} cy={48} r={42} fill="#F59E0B" />
            <Circle cx={48} cy={48} r={29} fill="#111111" />
            <SvgText x={48} y={55} textAnchor="middle" fill="#F59E0B" fontSize={20} fontWeight="700">
              Ω
            </SvgText>
          </Svg>
          <Text className="mt-4 text-2xl font-bold text-neutral-100">ColorOhm</Text>
          <Text className="mt-1 text-neutral-400">v{version}</Text>
          <Text className="mt-3 text-center text-neutral-300">
            ColorOhm is an EE toolkit for reading and decoding resistor color codes - built by RSMK.
          </Text>
        </View>

        <View className="gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://colorohm.rsmk.me')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-amber-400">colorohm.rsmk.me</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://rsmk.me')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-neutral-200">rsmk.me portfolio</Text>
          </Pressable>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Text className="mb-2 text-lg font-semibold text-neutral-100">Built With</Text>
          <Text className="text-neutral-300">React Native</Text>
          <Text className="text-neutral-300">Expo</Text>
          <Text className="text-neutral-300">NativeWind</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
