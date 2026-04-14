import * as Haptics from 'expo-haptics';

/** Successful decode/calculation */
export async function onSuccess() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Invalid input / error */
export async function onError() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/** Favorite starred/unstarred */
export async function onFavorite() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Tab switch / selection */
export async function onSelect() {
  await Haptics.selectionAsync();
}
