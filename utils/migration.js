import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearPersistedState } from './persistence';

const CURRENT_VERSION = 1;
const VERSION_KEY = '@smartcart/data_version';

const validateMigratedData = (data) => {
  try {
    const { lists, malls, settings } = data;

    // Basic structure validation
    if (!lists || !malls || !settings) {
      return false;
    }

    // Parse and validate each piece of data
    const parsedLists = JSON.parse(lists);
    const parsedMalls = JSON.parse(malls);
    const parsedSettings = JSON.parse(settings);

    return (
      Array.isArray(parsedLists?.lists) &&
      Array.isArray(parsedMalls?.malls) &&
      typeof parsedSettings === 'object'
    );
  } catch (error) {
    return false;
  }
};

const migrations = {
  1: async (data) => {
    try {
      // Validate data before migration
      if (!validateMigratedData(data)) {
        throw new Error('Invalid data structure');
      }
      return data;
    } catch (error) {
      throw new Error('Migration 1 failed: ' + error.message);
    }
  },
  // Add future migrations here as app evolves
  // 2: async (data) => { ... },
  // 3: async (data) => { ... },
};

export const checkAndMigrateData = async () => {
  try {
    const currentVersion =
      parseInt(await AsyncStorage.getItem(VERSION_KEY)) || 0;

    if (currentVersion === CURRENT_VERSION) {
      return true;
    }

    // If version is higher than current, data might be from a newer app version
    if (currentVersion > CURRENT_VERSION) {
      console.warn('Data version is newer than app version, clearing data');
      await clearPersistedState();
      await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
      return true;
    }

    // Collect all data before migration
    const data = {
      lists: await AsyncStorage.getItem('@smartcart/lists'),
      malls: await AsyncStorage.getItem('@smartcart/malls'),
      settings: await AsyncStorage.getItem('@smartcart/settings'),
      prices: await AsyncStorage.getItem('@smartcart/prices'),
    };

    // Apply migrations in order
    for (
      let version = currentVersion + 1;
      version <= CURRENT_VERSION;
      version++
    ) {
      if (migrations[version]) {
        try {
          await migrations[version](data);
        } catch (error) {
          console.error(`Migration to version ${version} failed:`, error);
          // Clear data and start fresh if migration fails
          await clearPersistedState();
          await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
          return true;
        }
      }
    }

    // Update version number after successful migration
    await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    return true;
  } catch (error) {
    console.error('Error during data migration:', error);
    // Clear all data and start fresh if anything goes wrong
    await clearPersistedState();
    await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    return true;
  }
};

export const getCurrentVersion = async () => {
  try {
    return parseInt(await AsyncStorage.getItem(VERSION_KEY)) || 0;
  } catch (error) {
    console.error('Error getting current version:', error);
    return 0;
  }
};
