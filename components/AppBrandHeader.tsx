import { Image, Pressable, Text, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

type AppBrandHeaderProps = {
  subtitle: string;
  pulseOnMount?: boolean;
};

export function AppBrandHeader({ subtitle, pulseOnMount }: AppBrandHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  const pulseScale = useSharedValue(1);
  useEffect(() => {
    if (pulseOnMount) {
      pulseScale.value = withSequence(
        withTiming(1.08, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [pulseOnMount, pulseScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const tapCount = useRef(0);
  const firstTapTime = useRef(0);

  const handleTitleTap = () => {
    const now = Date.now();
    if (now - firstTapTime.current > 3000) {
      tapCount.current = 1;
      firstTapTime.current = now;
    } else {
      tapCount.current += 1;
    }

    if (tapCount.current >= 7 && now - firstTapTime.current <= 3000) {
      tapCount.current = 0;
      router.push('/EasterEgg');
    }
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      className="rounded-3xl border border-border bg-surface p-4"
      style={{
        shadowColor: '#00D4FF',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }}
    >
      <View className="flex-row items-center gap-3">
        {/* Hamburger button */}
        <Pressable
          onPress={openDrawer}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card"
        >
          <Ionicons name="menu" size={22} color="#EAEAEA" />
        </Pressable>

        <Pressable onPress={handleTitleTap} className="flex-row items-center gap-3 flex-1">
          <Animated.View className="h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-card" style={animatedStyle}>
            <Image
              source={require('../assets/icon.png')}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
          </Animated.View>

          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: '#EAEAEA' }}>ColorOhm</Text>
            <Text className="text-xs uppercase tracking-wider text-accent">by RSMK</Text>
          </View>
        </Pressable>
      </View>

      <Text className="mt-3" style={{ color: '#9CA3AF' }}>{subtitle}</Text>
    </View>
  );
}
