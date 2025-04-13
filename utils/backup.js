import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const BACKUP_KEYS = [
  'smartcart_lists',
  'smartcart_malls',
  'smartcart_prices',
  'user_settings',
  'user_profile',
];

export async function createBackup() {
  try {
    const backupData = {};

    // Collect all data from AsyncStorage
    await Promise.all(
      BACKUP_KEYS.map(async (key) => {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          backupData[key] = JSON.parse(value);
        }
      })
    );

    // Create backup file
    const backupString = JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: backupData,
    });

    const backupPath = `${
      FileSystem.documentDirectory
    }smartcart_backup_${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(backupPath, backupString);

    // Share backup file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupPath);
    }

    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
}

export async function restoreBackup(backupFile) {
  try {
    const backupContent = await FileSystem.readAsStringAsync(backupFile);
    const backup = JSON.parse(backupContent);

    if (!backup.data || !backup.version) {
      throw new Error('Invalid backup file format');
    }

    // Clear existing data
    await AsyncStorage.multiRemove(BACKUP_KEYS);

    // Restore data
    await Promise.all(
      Object.entries(backup.data).map(([key, value]) =>
        AsyncStorage.setItem(key, JSON.stringify(value))
      )
    );

    return true;
  } catch (error) {
    console.error('Error restoring backup:', error);
    return false;
  }
}

export async function scheduleAutomaticBackup() {
  try {
    const lastBackup = await AsyncStorage.getItem('last_auto_backup');
    const now = new Date();

    if (!lastBackup || now - new Date(lastBackup) > 7 * 24 * 60 * 60 * 1000) {
      await createBackup();
      await AsyncStorage.setItem('last_auto_backup', now.toISOString());
    }
  } catch (error) {
    console.error('Error scheduling backup:', error);
  }
}
