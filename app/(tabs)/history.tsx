import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeOut, Layout, SlideOutRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { AppBrandHeader } from '../../components/AppBrandHeader';
import { HistoryEntry, getHistory, removeHistory, clearHistory } from '../../utils/storage';
import { formatRelativeTime, getDateGroup, DateGroup } from '../../utils/formatTime';
import { onSelect } from '../../utils/haptics';

type TypeBadge = {
  label: string;
  color: string;
};

function getTypeBadge(type: HistoryEntry['type']): TypeBadge {
  switch (type) {
    case 'color_band':
      return { label: 'Color Band', color: '#00D4FF' };
    case 'smd':
      return { label: 'SMD', color: '#00D4FF' };
    case 'encode':
      return { label: 'Encode', color: '#00D4FF' };
    default:
      return { label: type, color: '#00D4FF' };
  }
}

type SectionData = {
  title: DateGroup;
  data: HistoryEntry[];
};

function groupByDate(entries: HistoryEntry[]): SectionData[] {
  const groups: Record<DateGroup, HistoryEntry[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  for (const entry of entries) {
    const group = getDateGroup(entry.timestamp);
    groups[group].push(entry);
  }

  const result: SectionData[] = [];
  if (groups.Today.length > 0) result.push({ title: 'Today', data: groups.Today });
  if (groups.Yesterday.length > 0) result.push({ title: 'Yesterday', data: groups.Yesterday });
  if (groups.Earlier.length > 0) result.push({ title: 'Earlier', data: groups.Earlier });
  return result;
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setEntries(data);
    setSections(groupByDate(data));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleDelete = async (id: string) => {
    await onSelect();
    await removeHistory(id);
    await loadHistory();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            await loadHistory();
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: HistoryEntry, index: number }) => {
    const badge = getTypeBadge(item.type);
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 40)}
        exiting={SlideOutRight.duration(250)}
        layout={Layout.springify()}
      >
        <View className="flex-row items-center rounded-2xl border border-border bg-surface p-3 mb-2">
          {/* Type badge */}
          <View
            className="rounded-full px-2 py-1 mr-3"
            style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)' }}
          >
            <Text className="text-[11px] font-semibold" style={{ color: badge.color }}>{badge.label}</Text>
          </View>

          {/* Center: input + result */}
          <View className="flex-1 mr-2">
            <Text className="text-sm" style={{ color: '#9CA3AF' }} numberOfLines={1}>{item.input}</Text>
            <Text className="text-base font-bold" style={{ color: '#EAEAEA' }} numberOfLines={1}>{item.result}</Text>
          </View>

          {/* Right: time + delete */}
          <View className="items-end gap-1">
            <Text className="text-xs" style={{ color: '#6B7280' }}>{formatRelativeTime(item.timestamp)}</Text>
            <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSectionHeader = (title: string) => (
    <View className="py-2">
      <Text className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
        {title}
      </Text>
    </View>
  );

  // Flatten sections into a FlatList-compatible structure
  const flatData: (HistoryEntry | { _sectionTitle: string })[] = [];
  for (const section of sections) {
    flatData.push({ _sectionTitle: section.title } as any);
    for (const item of section.data) {
      flatData.push(item);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card"
            >
              <Ionicons name="menu" size={22} color="#EAEAEA" />
            </Pressable>
            <Text className="text-2xl font-bold" style={{ color: '#EAEAEA' }}>History</Text>
          </View>
          {entries.length > 0 ? (
            <Pressable onPress={handleClearAll} hitSlop={8}>
              <Text className="text-sm" style={{ color: '#EF4444' }}>Clear All</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {entries.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="time-outline" size={48} color="#6B7280" />
          <Text className="text-sm" style={{ color: '#6B7280' }}>No history yet</Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item, index) => ('_sectionTitle' in item ? `section-${index}` : (item as HistoryEntry).id)}
          renderItem={({ item, index }) => {
            if ('_sectionTitle' in item) {
              return renderSectionHeader((item as any)._sectionTitle);
            }
            return renderItem({ item: item as HistoryEntry, index });
          }}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
