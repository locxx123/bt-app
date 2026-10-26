import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

export const getCache = async <T>(key: string): Promise<CacheEntry<T> | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
};

export const setCache = async <T>(key: string, data: T): Promise<number> => {
  const savedAt = Date.now();
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, savedAt }));
  } catch {
    // Bộ nhớ đệm lỗi không được làm hỏng luồng chính
  }
  return savedAt;
};
