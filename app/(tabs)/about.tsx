import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { AppBrandHeader } from '../../components/AppBrandHeader';

export default function AboutScreen() {
  const version = '1.2.0';

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AppBrandHeader subtitle="Your pocket resistor decoder" />

        <View className="rounded-2xl border border-border bg-surface p-5">
          <Text className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>ColorOhm</Text>
          <Text className="mt-1" style={{ color: '#9CA3AF' }}>Tagline: Your pocket resistor decoder</Text>
          <Text className="mt-1" style={{ color: '#9CA3AF' }}>Version: {version}</Text>
        </View>

        <View className="rounded-2xl border border-border bg-surface p-5">
          <Text className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>About the App</Text>
          <Text className="mt-3" style={{ color: '#EAEAEA' }}>
            ColorOhm started as a simple web tool I built to stop Googling resistor color codes every time I picked up a component. Turns out, a lot of people needed the same thing.
          </Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>
            ColorOhm lets you decode resistor color bands instantly and supports 3, 4, 5, and 6-band resistors with tolerance and temperature coefficient readings.
          </Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>
            There is also a reverse encoder if you know the value and need the bands, plus a full color code reference chart so you never have to memorize the mnemonic again.
          </Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>
            Built for electronics students, hobbyists, and anyone who has ever squinted at a tiny brown-black-red resistor under bad lighting.
          </Text>
        </View>

        <View className="rounded-2xl border border-border bg-surface p-5">
          <Text className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>About Me</Text>
          <Text className="mt-3" style={{ color: '#EAEAEA' }}>
            Hey, I am RSMK, an Electrical and Electronics Engineering student with a thing for building at the intersection of hardware and software.
          </Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>
            I work with ESP32, Arduino, IoT systems, and web dashboards, and I build tools like ColorOhm to scratch my own itches.
          </Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>
            ColorOhm is one of several projects living at rsmk.me, my portfolio where I document everything I build, from smart firefighter monitoring wearables to resistor calculators.
          </Text>
        </View>

        <View className="gap-2 rounded-2xl border border-border bg-surface p-4">
          <Text className="mb-1 text-lg font-semibold" style={{ color: '#EAEAEA' }}>Links</Text>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://rsmk.me')}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <Text className="text-center font-semibold" style={{ color: '#EAEAEA' }}>Portfolio</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://colorohm.rsmk.me')}
            className="rounded-xl border border-accent/40 px-4 py-3"
            style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
          >
            <Text className="text-center font-semibold text-accent">ColorOhm Web</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://www.linkedin.com/in/srinivasamanikanta/')}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <Text className="text-center font-semibold" style={{ color: '#EAEAEA' }}>LinkedIn</Text>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://github.com/Rsmk27')}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <Text className="text-center font-semibold" style={{ color: '#EAEAEA' }}>GitHub</Text>
          </Pressable>
        </View>

        <View className="rounded-2xl border border-border bg-surface p-4">
          <Text className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>Footer Note</Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>ColorOhm is part of the RSMK project ecosystem, tools built by an engineer, for engineers.</Text>
          <Text className="mt-2" style={{ color: '#EAEAEA' }}>Made with coffee and a lot of resistors.</Text>
          <Text className="mt-2 text-accent">by RSMK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
