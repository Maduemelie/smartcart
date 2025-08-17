import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useMall } from '../context/mall/MallContext';
import { useList } from '../context/list/ListContext';
import { calculateDistance } from '../utils/location';

export const useStoreRecommendation = (list) => {
  const { state: mallState } = useMall();
  const { state: listState } = useList();

  const { malls, favorites } = mallState;
  const { purchaseHistory } = listState;

  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  // 1. Get User Location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (err) {
        setError('Failed to get location');
        console.error('Error getting location:', err);
      }
    })();
  }, []);

  // 2. Main recommendation logic
  useEffect(() => {
    if (
      !list ||
      !list.items ||
      list.items.length === 0 ||
      !malls ||
      malls.length === 0 ||
      !purchaseHistory ||
      purchaseHistory.length === 0 ||
      !userLocation // Wait for location to be available
    ) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setRecommendation(null); // Reset recommendation on new calculation

    // --- Start Real Logic ---

    // Step 1: Get shopping list item info
    const shoppingListItems = new Map(
      list.items.map((item) => [item.id, item])
    );
    const shoppingListItemIds = new Set(shoppingListItems.keys());

    // Step 2: Cross-reference with purchase history to find item availability and last prices.
    // We build a map: Map<itemId, Map<storeId, { price: number, date: string }>>
    const itemPriceInfo = new Map();
    purchaseHistory.forEach((purchase) => {
      // The `itemId` field is crucial here
      if (
        shoppingListItemIds.has(purchase.itemId) &&
        purchase.storeId &&
        purchase.price != null
      ) {
        if (!itemPriceInfo.has(purchase.itemId)) {
          itemPriceInfo.set(purchase.itemId, new Map());
        }
        const storePriceMap = itemPriceInfo.get(purchase.itemId);
        const existingEntry = storePriceMap.get(purchase.storeId);

        // Only store the most recent price for each item-store pair
        if (
          !existingEntry ||
          new Date(purchase.datePurchased) > new Date(existingEntry.date)
        ) {
          storePriceMap.set(purchase.storeId, {
            price: purchase.price,
            date: purchase.datePurchased,
          });
        }
      }
    });

    // Step 2.5: Determine the best price for each available item
    const bestPrices = new Map();
    for (const [itemId, storePriceMap] of itemPriceInfo.entries()) {
      const minPrice = Math.min(
        ...[...storePriceMap.values()].map((p) => p.price)
      );
      if (minPrice !== Infinity) {
        bestPrices.set(itemId, minPrice);
      }
    }

    // Step 3: Score and Rank Stores
    const ITEM_MATCH_WEIGHT = 10;
    const BEST_PRICE_WEIGHT = 5;
    const FAVORITE_BONUS = 25; // A significant bonus for favorite stores
    const PROXIMITY_PENALTY = 0.5; // Points deducted per km

    const storeScores = malls.map((store) => {
      let itemsFound = 0;
      let bestPriceCount = 0;

      for (const itemId of shoppingListItemIds) {
        const storePriceMap = itemPriceInfo.get(itemId);
        if (storePriceMap && storePriceMap.has(store.id)) {
          itemsFound++;

          const storePrice = storePriceMap.get(store.id).price;
          const bestPrice = bestPrices.get(itemId);

          // Check if this store has the best price for the item
          if (storePrice === bestPrice) {
            bestPriceCount++;
          }
        }
      }

      // Calculate Favorite Bonus
      const isFavorite = favorites.includes(store.id);

      // Calculate Proximity Score
      const distance =
        userLocation && store.coordinates
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              store.coordinates.latitude,
              store.coordinates.longitude
            )
          : null;

      let score =
        itemsFound * ITEM_MATCH_WEIGHT + bestPriceCount * BEST_PRICE_WEIGHT;

      if (isFavorite) {
        score += FAVORITE_BONUS;
      }

      if (distance !== null) {
        // Lower distance is better. We penalize for distance.
        score -= distance * PROXIMITY_PENALTY;
      }

      return {
        store,
        score,
        itemsFound,
        bestPriceCount,
        isFavorite,
        distance,
      };
    });

    // Rank stores by score (descending)
    storeScores.sort((a, b) => b.score - a.score);

    // Step 4: Present the Recommendation
    const topScoringStore = storeScores[0];

    if (topScoringStore && topScoringStore.itemsFound > 0) {
      // Find which items this store has the best price for
      const bestPriceForItems = [];
      const topStoreId = topScoringStore.store.id;

      for (const itemId of shoppingListItemIds) {
        const storePriceMap = itemPriceInfo.get(itemId);
        if (storePriceMap && storePriceMap.has(topStoreId)) {
          const storePrice = storePriceMap.get(topStoreId).price;
          const bestPrice = bestPrices.get(itemId);
          if (storePrice === bestPrice) {
            bestPriceForItems.push(shoppingListItems.get(itemId).name);
          }
        }
      }

      setRecommendation({
        topStore: topScoringStore.store,
        details: {
          itemsFound: topScoringStore.itemsFound,
          totalItems: list.items.length,
          bestPriceFor: bestPriceForItems,
        },
      });
    } else {
      // No recommendation if no items were found in any store's history
      setRecommendation(null);
    }

    setIsLoading(false);
    // --- End Real Logic ---
  }, [list, malls, purchaseHistory, favorites, userLocation]);

  return { isLoading, recommendation, error };
};
