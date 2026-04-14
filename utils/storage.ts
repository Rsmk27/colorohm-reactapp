import AsyncStorage from '@react-native-async-storage/async-storage';

// ──── Types ────

export type HistoryEntry = {
  id: string;
  type: 'color_band' | 'smd' | 'encode';
  input: string;
  result: string;
  timestamp: number;
};

export type FavoriteEntry = {
  id: string;
  type: 'color_band' | 'smd' | 'encode';
  input: string;
  result: string;
  label: string;
  savedAt: number;
};

// ──── Keys ────

const HISTORY_KEY = 'colorohm_history';
const FAVORITES_KEY = 'colorohm_favorites';
const MAX_HISTORY = 20;

// ──── History ────

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<void> {
  const history = await getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function removeHistory(id: string): Promise<void> {
  const history = await getHistory();
  const updated = history.filter((e) => e.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

// ──── Favorites ────

export async function getFavorites(): Promise<FavoriteEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addFavorite(entry: Omit<FavoriteEntry, 'id' | 'savedAt' | 'label'>): Promise<FavoriteEntry> {
  const favorites = await getFavorites();
  const newEntry: FavoriteEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    label: '',
    savedAt: Date.now(),
  };
  const updated = [newEntry, ...favorites];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return newEntry;
}

export async function removeFavorite(id: string): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.filter((e) => e.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function updateFavoriteLabel(id: string, label: string): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.map((e) => (e.id === id ? { ...e, label } : e));
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isFavorited(input: string, result: string): Promise<FavoriteEntry | null> {
  const favorites = await getFavorites();
  return favorites.find((e) => e.input === input && e.result === result) ?? null;
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
