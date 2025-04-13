import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CacheManager from './cache';

const SYNC_QUEUE_KEY = '@smartcart/sync_queue';
const LAST_SYNC_KEY = '@smartcart/last_sync';

class SyncManager {
  static instance = null;
  static isOnline = true;
  static isSyncing = false;
  static syncQueue = [];

  static async initialize() {
    if (this.instance) return this.instance;

    // Load sync queue from storage
    try {
      const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (queueData) {
        this.syncQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }

    // Subscribe to network state changes
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;

      if (wasOffline && this.isOnline) {
        this.syncQueuedChanges();
      }
    });

    // Initial network check
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected && netInfo.isInternetReachable;

    this.instance = this;
    return this.instance;
  }

  static async queueChange(type, data) {
    const change = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      deviceId: await this.getDeviceId(),
    };

    this.syncQueue.push(change);
    await this.persistQueue();

    if (this.isOnline) {
      this.syncQueuedChanges();
    }

    return change.id;
  }

  static async syncQueuedChanges() {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      const changes = [...this.syncQueue];
      let success = true;

      // Process each change in order
      for (const change of changes) {
        try {
          // In a real app, this would make API calls to sync with backend
          // For now, we'll just simulate successful syncing
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Remove successfully synced change from queue
          this.syncQueue = this.syncQueue.filter(
            (item) => item.id !== change.id
          );
          await this.persistQueue();

          // Update last sync time
          await this.updateLastSyncTime();
        } catch (error) {
          console.error('Error syncing change:', error);
          success = false;
          break;
        }
      }

      return success;
    } finally {
      this.isSyncing = false;
    }
  }

  static async persistQueue() {
    try {
      await AsyncStorage.setItem(
        SYNC_QUEUE_KEY,
        JSON.stringify(this.syncQueue)
      );
    } catch (error) {
      console.error('Error persisting sync queue:', error);
    }
  }

  static async getLastSyncTime() {
    try {
      return await AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  static async updateLastSyncTime() {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now);
      return now;
    } catch (error) {
      console.error('Error updating last sync time:', error);
      return null;
    }
  }

  static async getDeviceId() {
    try {
      let deviceId = await AsyncStorage.getItem('@smartcart/device_id');
      if (!deviceId) {
        deviceId = `${Platform.OS}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;
        await AsyncStorage.setItem('@smartcart/device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  }

  static async clearSyncQueue() {
    try {
      this.syncQueue = [];
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing sync queue:', error);
      return false;
    }
  }

  static getQueueStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      queue: [...this.syncQueue],
    };
  }
}

export default SyncManager;
