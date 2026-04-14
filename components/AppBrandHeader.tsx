import { Image, Pressable, Text, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type AppBrandHeaderProps = {
  subtitle: string;
};

export function AppBrandHeader({ subtitle }: AppBrandHeaderProps) {
  const navigation = useNavigation();

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

        <View className="h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-card">
          <Image
            source={require('../assets/icon.png')}
            style={{ width: 34, height: 34 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: '#EAEAEA' }}>ColorOhm</Text>
          <Text className="text-xs uppercase tracking-wider text-accent">by RSMK</Text>
        </View>
      </View>

      <Text className="mt-3" style={{ color: '#9CA3AF' }}>{subtitle}</Text>
    </View>
  );
}
