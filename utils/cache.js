import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheManager {
  static #memoryCache = new Map();
  static #defaultTTL = 1000 * 60 * 60; // 1 hour

  static async set(key, value, ttl = this.#defaultTTL) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory
    this.#memoryCache.set(key, item);

    // Store in persistent storage
    try {
      await AsyncStorage.setItem(
        `@smartcart/cache/${key}`,
        JSON.stringify(item)
      );
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  static async get(key) {
    // Try memory cache first
    const memoryItem = this.#memoryCache.get(key);
    if (memoryItem && !this.#isExpired(memoryItem)) {
      return memoryItem.value;
    }

    // Try persistent storage
    try {
      const data = await AsyncStorage.getItem(`@smartcart/cache/${key}`);
      if (!data) return null;

      const item = JSON.parse(data);
      if (this.#isExpired(item)) {
        await this.remove(key);
        return null;
      }

      // Update memory cache
      this.#memoryCache.set(key, item);
      return item.value;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  static async remove(key) {
    this.#memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(`@smartcart/cache/${key}`);
      return true;
    } catch (error) {
      console.error('Error removing from cache:', error);
      return false;
    }
  }

  static async clear() {
    this.#memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith('@smartcart/cache/')
      );
      await AsyncStorage.multiRemove(cacheKeys);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  static #isExpired(item) {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Utility method for price data caching
  static async cachePriceData(mallId, itemId, price) {
    const key = `price_${mallId}_${itemId}`;
    await this.set(key, {
      price,
      lastUpdated: Date.now(),
    });
  }

  // Utility method for list data caching
  static async cacheListData(listId, data) {
    const key = `list_${listId}`;
    await this.set(key, data);
  }

  // Utility method for mall data caching
  static async cacheMallData(mallId, data) {
    const key = `mall_${mallId}`;
    await this.set(key, data);
  }

  // Utility method to prefetch frequently accessed data
  static async prefetchData(keys) {
    const promises = keys.map(async (key) => {
      const data = await AsyncStorage.getItem(`@smartcart/cache/${key}`);
      if (data) {
        const item = JSON.parse(data);
        if (!this.#isExpired(item)) {
          this.#memoryCache.set(key, item);
        }
      }
    });

    await Promise.all(promises);
  }

  // Utility method to get cache stats
  static async getStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith('@smartcart/cache/')
      );

      return {
        memoryItemCount: this.#memoryCache.size,
        persistentItemCount: cacheKeys.length,
        memoryKeys: Array.from(this.#memoryCache.keys()),
        persistentKeys: cacheKeys,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
}

export default CacheManager;
