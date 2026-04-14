import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onSelect } from '../../utils/haptics';

type DrawerIcon = {
  name: string;
  focusedName: string;
};

const SCREENS: { key: string; title: string; icon: DrawerIcon; section: 'tools' | 'data' | 'info' }[] = [
  { key: 'decode', title: 'Decode', icon: { name: 'color-filter-outline', focusedName: 'color-filter' }, section: 'tools' },
  { key: 'encode', title: 'Encode', icon: { name: 'flash-outline', focusedName: 'flash' }, section: 'tools' },
  { key: 'smd', title: 'SMD Decoder', icon: { name: 'hardware-chip-outline', focusedName: 'hardware-chip' }, section: 'tools' },
  { key: 'history', title: 'History', icon: { name: 'time-outline', focusedName: 'time' }, section: 'data' },
  { key: 'favorites', title: 'Favorites', icon: { name: 'star-outline', focusedName: 'star' }, section: 'data' },
  { key: 'reference', title: 'Reference', icon: { name: 'book-outline', focusedName: 'book' }, section: 'info' },
  { key: 'about', title: 'About', icon: { name: 'information-circle-outline', focusedName: 'information-circle' }, section: 'info' },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <View className="px-4 pt-5 pb-1">
      <Text className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>
        {label}
      </Text>
    </View>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const currentRoute = props.state.routes[props.state.index]?.name;

  const navigate = (key: string) => {
    onSelect();
    (props.navigation as any).navigate(key);
  };

  const renderSection = (section: 'tools' | 'data' | 'info', label: string) => {
    const items = SCREENS.filter((s) => s.section === section);
    return (
      <View key={section}>
        <SectionLabel label={label} />
        {items.map((screen) => {
          const focused = currentRoute === screen.key;
          const iconName = focused ? screen.icon.focusedName : screen.icon.name;
          return (
            <DrawerItem
              key={screen.key}
              label={screen.title}
              focused={focused}
              onPress={() => navigate(screen.key)}
              icon={({ size }) => (
                <Ionicons
                  name={iconName as any}
                  size={size}
                  color={focused ? '#00D4FF' : '#9CA3AF'}
                />
              )}
              activeTintColor="#00D4FF"
              inactiveTintColor="#EAEAEA"
              activeBackgroundColor="rgba(0, 212, 255, 0.1)"
              style={{ borderRadius: 12, marginHorizontal: 8 }}
              labelStyle={{ fontSize: 14, fontWeight: focused ? '700' : '500' }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0E0E11' }}>
      {/* Header / Brand */}
      <View
        style={{ paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 }}
        className="border-b border-border"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-card">
            <Image
              source={require('../../assets/icon.png')}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-xl font-bold" style={{ color: '#EAEAEA' }}>ColorOhm</Text>
            <Text className="text-xs text-accent">by RSMK</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('tools', 'Tools')}
        {renderSection('data', 'Your Data')}
        {renderSection('info', 'Info')}
      </DrawerContentScrollView>

      {/* Footer */}
      <View className="border-t border-border px-5 py-3" style={{ paddingBottom: insets.bottom + 8 }}>
        <Text className="text-xs" style={{ color: '#6B7280' }}>v1.2.0 • Made with ⚡ by RSMK</Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <Drawer.Screen name="decode" options={{ title: 'Decode' }} />
      <Drawer.Screen name="encode" options={{ title: 'Encode' }} />
      <Drawer.Screen name="smd" options={{ title: 'SMD Decoder' }} />
      <Drawer.Screen name="history" options={{ title: 'History' }} />
      <Drawer.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Drawer.Screen name="reference" options={{ title: 'Reference' }} />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
    </Drawer>
  );
}
