import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LISTS: '@smartcart/lists',
  MALLS: '@smartcart/malls',
  SETTINGS: '@smartcart/settings',
  PRICES: '@smartcart/prices',
};

const validateState = (state, key) => {
  switch (key) {
    case 'LISTS':
      return state && Array.isArray(state.lists);
    case 'MALLS':
      return state && Array.isArray(state.malls);
    case 'SETTINGS':
      return state && typeof state === 'object';
    case 'PRICES':
      return state && Array.isArray(state.priceHistory);
    default:
      return true;
  }
};

export const persistState = async (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEYS[key], serializedState);
    return true;
  } catch (error) {
    console.error(`Error persisting ${key} state:`, error);
    return false;
  }
};

export const loadPersistedState = async (key) => {
  try {
    const serializedState = await AsyncStorage.getItem(STORAGE_KEYS[key]);
    if (serializedState === null) {
      return null;
    }

    const parsedState = JSON.parse(serializedState);

    // Validate the loaded state
    if (!validateState(parsedState, key)) {
      console.warn(
        `Invalid state structure for ${key}, clearing corrupted data`
      );
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
      return null;
    }

    return parsedState;
  } catch (error) {
    console.error(`Error loading ${key} state:`, error);
    // Clear corrupted data
    await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    return null;
  }
};

export const clearPersistedState = async (key) => {
  try {
    if (key) {
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    } else {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    }
    return true;
  } catch (error) {
    console.error('Error clearing persisted state:', error);
    return false;
  }
};

export const hydrateState = async () => {
  try {
    const [lists, malls, settings, prices] = await Promise.all([
      loadPersistedState('LISTS'),
      loadPersistedState('MALLS'),
      loadPersistedState('SETTINGS'),
      loadPersistedState('PRICES'),
    ]);

    return {
      lists: lists || { lists: [], history: [] },
      malls: malls || { malls: [], favorites: [] },
      settings: settings || {
        theme: 'system',
        notifications: true,
        autoBackup: true,
      },
      prices: prices || { priceHistory: [], lastUpdate: null },
    };
  } catch (error) {
    console.error('Error hydrating state:', error);
    // Return default state instead of null
    return {
      lists: { lists: [], history: [] },
      malls: { malls: [], favorites: [] },
      settings: {
        theme: 'system',
        notifications: true,
        autoBackup: true,
      },
      prices: { priceHistory: [], lastUpdate: null },
    };
  }
};
