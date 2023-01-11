import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStore provides API for IOS and Android storage similar web local storage
 * Basically it's used for caching the data
 */
export default {
  getItem: async (key: string, defaultValue: any) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) {
        return defaultValue;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  },
  setItem: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
  multiGet: (keys: string[]) => {
    try {
      return AsyncStorage.multiGet(keys);
    } catch (e) {
      console.error(e);
    }
  },
  multiSet: async (keyValuePairs: [string, string][]) => {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (e) {
      console.error(e);
    }
  },
};
