import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export async function pickCustomBackgroundImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: false,
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return result.assets[0].uri;
}

export async function copyBackgroundToAppStorage(uri: string): Promise<string | null> {
  try {
    const dest = `${FileSystem.documentDirectory}stratus_bg_${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch {
    return null;
  }
}

export async function deleteCustomBackground(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // non-fatal
  }
}
