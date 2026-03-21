import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#2A2A2A',
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen name="decode" options={{ title: 'Decode' }} />
      <Tabs.Screen name="encode" options={{ title: 'Encode' }} />
      <Tabs.Screen name="reference" options={{ title: 'Reference' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  );
}
