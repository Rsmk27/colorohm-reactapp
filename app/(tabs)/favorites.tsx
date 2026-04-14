import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeIn, SlideOutRight, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { FavoriteEntry, getFavorites, removeFavorite, updateFavoriteLabel } from '../../utils/storage';
import { onSelect, onFavorite } from '../../utils/haptics';

type TypeBadge = {
  label: string;
  color: string;
};

function getTypeBadge(type: FavoriteEntry['type']): TypeBadge {
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

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<FavoriteEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const loadFavorites = useCallback(async () => {
    const data = await getFavorites();
    setEntries(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleDelete = async (id: string) => {
    await onSelect();
    await removeFavorite(id);
    await loadFavorites();
  };

  const handleStartEdit = (entry: FavoriteEntry) => {
    setEditingId(entry.id);
    setEditText(entry.label || entry.result);
  };

  const handleSaveLabel = async (id: string) => {
    await updateFavoriteLabel(id, editText.trim());
    setEditingId(null);
    await loadFavorites();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to clear all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const { clearFavorites } = await import('../../utils/storage');
            await clearFavorites();
            await loadFavorites();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: FavoriteEntry }) => {
    const badge = getTypeBadge(item.type);
    const isEditing = editingId === item.id;

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={SlideOutRight.duration(250)}
        layout={Layout.springify()}
      >
        <View className="flex-row items-center rounded-2xl border border-border bg-surface p-3 mb-2">
          {/* Star icon */}
          <Pressable
            onPress={async () => {
              await onFavorite();
              handleDelete(item.id);
            }}
            hitSlop={8}
            className="mr-3"
          >
            <Ionicons name="star" size={20} color="#FFD700" />
          </Pressable>

          {/* Center */}
          <View className="flex-1 mr-2">
            {isEditing ? (
              <TextInput
                className="rounded-lg border border-accent bg-card px-2 py-1 text-sm"
                style={{ color: '#EAEAEA' }}
                value={editText}
                onChangeText={setEditText}
                onBlur={() => handleSaveLabel(item.id)}
                onSubmitEditing={() => handleSaveLabel(item.id)}
                autoFocus
                returnKeyType="done"
              />
            ) : (
              <Pressable onPress={() => handleStartEdit(item)}>
                <Text className="text-sm" style={{ color: '#9CA3AF' }} numberOfLines={1}>
                  {item.label || 'Tap to add label'}
                </Text>
              </Pressable>
            )}
            <Text className="text-base font-bold mt-0.5" style={{ color: '#EAEAEA' }} numberOfLines={1}>
              {item.result}
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: '#6B7280' }} numberOfLines={1}>
              {item.input}
            </Text>
          </View>

          {/* Badge + delete */}
          <View className="items-end gap-1">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)' }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: badge.color }}>{badge.label}</Text>
            </View>
            <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  };

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
            <Text className="text-2xl font-bold" style={{ color: '#EAEAEA' }}>Favorites</Text>
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
          <Ionicons name="star-outline" size={48} color="#6B7280" />
          <Text className="text-sm" style={{ color: '#6B7280' }}>No favorites saved yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
