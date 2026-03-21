import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { AppBrandHeader } from '../../components/AppBrandHeader';

export default function AboutScreen() {
  const version = '1.0.0';

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AppBrandHeader subtitle="Your pocket resistor decoder" />

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <Text className="text-lg font-semibold text-neutral-100">ColorOhm</Text>
          <Text className="mt-1 text-neutral-300">Tagline: Your pocket resistor decoder</Text>
          <Text className="mt-1 text-neutral-300">Version: {version}</Text>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <Text className="text-lg font-semibold text-neutral-100">About the App</Text>
          <Text className="mt-3 text-neutral-300">
            ColorOhm started as a simple web tool I built to stop Googling resistor color codes every time I picked up a component. Turns out, a lot of people needed the same thing.
          </Text>
          <Text className="mt-2 text-neutral-300">
            ColorOhm lets you decode resistor color bands instantly and supports 3, 4, 5, and 6-band resistors with tolerance and temperature coefficient readings.
          </Text>
          <Text className="mt-2 text-neutral-300">
            There is also a reverse encoder if you know the value and need the bands, plus a full color code reference chart so you never have to memorize the mnemonic again.
          </Text>
          <Text className="mt-2 text-neutral-300">
            Built for electronics students, hobbyists, and anyone who has ever squinted at a tiny brown-black-red resistor under bad lighting.
          </Text>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <Text className="text-lg font-semibold text-neutral-100">About Me</Text>
          <Text className="mt-3 text-neutral-300">
            Hey, I am RSMK, an Electrical and Electronics Engineering student with a thing for building at the intersection of hardware and software.
          </Text>
          <Text className="mt-2 text-neutral-300">
            I work with ESP32, Arduino, IoT systems, and web dashboards, and I build tools like ColorOhm to scratch my own itches.
          </Text>
          <Text className="mt-2 text-neutral-300">
            ColorOhm is one of several projects living at rsmk.me, my portfolio where I document everything I build, from smart firefighter monitoring wearables to resistor calculators.
          </Text>
        </View>

        <View className="gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Text className="mb-1 text-lg font-semibold text-neutral-100">Links</Text>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://rsmk.me')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-neutral-200">Portfolio</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://colorohm.rsmk.me')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-amber-400">ColorOhm Web</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://www.linkedin.com/in/srinivasamanikanta/')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-neutral-200">LinkedIn</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://github.com/Rsmk27')}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
          >
            <Text className="text-center font-semibold text-neutral-200">GitHub</Text>
          </Pressable>
        </View>

        <View className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <Text className="text-lg font-semibold text-neutral-100">Footer Note</Text>
          <Text className="mt-2 text-neutral-300">ColorOhm is part of the RSMK project ecosystem, tools built by an engineer, for engineers.</Text>
          <Text className="mt-2 text-neutral-300">Made with coffee and a lot of resistors.</Text>
          <Text className="mt-2 text-amber-400">by RSMK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
