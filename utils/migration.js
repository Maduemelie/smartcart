import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_VERSION = 1;
const VERSION_KEY = '@smartcart/data_version';

const migrations = {
  1: async (data) => {
    // First version, no migrations needed
    return data;
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

    // Apply migrations in order
    for (
      let version = currentVersion + 1;
      version <= CURRENT_VERSION;
      version++
    ) {
      if (migrations[version]) {
        await migrations[version]({
          lists: await AsyncStorage.getItem('@smartcart/lists'),
          malls: await AsyncStorage.getItem('@smartcart/malls'),
          settings: await AsyncStorage.getItem('@smartcart/settings'),
          prices: await AsyncStorage.getItem('@smartcart/prices'),
        });
      }
    }

    // Update version number
    await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    return true;
  } catch (error) {
    console.error('Error during data migration:', error);
    return false;
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
