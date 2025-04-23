import { MALL_ACTIONS } from '../actions';

export function mallReducer(state, action) {
  switch (action.type) {
    case MALL_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        malls: action.payload.malls || [],
        priceHistory: action.payload.priceHistory || [],
        favorites: action.payload.favorites || [],
        lastVisited: action.payload.lastVisited || null,
        listsByMall: action.payload.listsByMall || {},
        mallStats: action.payload.mallStats || {},
      };

    case MALL_ACTIONS.ADD_MALL:
      // Only add if mall doesn't exist
      const mallExists = state.malls.some(
        (mall) => mall.name.toLowerCase() === action.payload.name.toLowerCase()
      );

      if (mallExists) {
        return {
          ...state,
          malls: state.malls.map((mall) =>
            mall.name.toLowerCase() === action.payload.name.toLowerCase()
              ? { ...mall, lastVisited: new Date().toISOString() }
              : mall
          ),
        };
      }

      const newMall = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
      };

      return {
        ...state,
        malls: [...state.malls, newMall],
        listsByMall: {
          ...state.listsByMall,
          [newMall.id]: [],
        },
        mallStats: {
          ...state.mallStats,
          [newMall.id]: {
            totalLists: 0,
            totalPriceUpdates: 0,
            averagePrices: {},
            lastUpdate: new Date().toISOString(),
          },
        },
      };

    case MALL_ACTIONS.UPDATE_MALL:
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === action.payload.mallId
            ? {
                ...mall,
                ...action.payload.updates,
                updatedAt: new Date().toISOString(),
              }
            : mall
        ),
      };

    case MALL_ACTIONS.DELETE_MALL:
      const { [action.payload]: deletedMallLists, ...remainingLists } =
        state.listsByMall;
      const { [action.payload]: deletedMallStats, ...remainingStats } =
        state.mallStats;

      return {
        ...state,
        malls: state.malls.filter((mall) => mall.id !== action.payload),
        favorites: state.favorites.filter((id) => id !== action.payload),
        priceHistory: state.priceHistory.filter(
          (record) => record.mallId !== action.payload
        ),
        listsByMall: remainingLists,
        mallStats: remainingStats,
      };

    case MALL_ACTIONS.ADD_STORE:
      const { mallId, store } = action.payload;
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === mallId
            ? {
                ...mall,
                stores: [
                  ...(mall.stores || []),
                  { ...store, id: Date.now().toString() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : mall
        ),
      };

    case MALL_ACTIONS.UPDATE_STORE:
      const { mallId: updateMallId, storeId, updates } = action.payload;
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === updateMallId
            ? {
                ...mall,
                stores: mall.stores.map((store) =>
                  store.id === storeId
                    ? {
                        ...store,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                      }
                    : store
                ),
                updatedAt: new Date().toISOString(),
              }
            : mall
        ),
      };

    case MALL_ACTIONS.DELETE_STORE:
      const { mallId: deleteMallId, storeId: deleteStoreId } = action.payload;
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === deleteMallId
            ? {
                ...mall,
                stores: mall.stores.filter(
                  (store) => store.id !== deleteStoreId
                ),
                updatedAt: new Date().toISOString(),
              }
            : mall
        ),
      };

    case MALL_ACTIONS.ADD_PRICE_RECORD:
      const record = {
        id: Date.now().toString(),
        mallId: action.payload.mallId,
        storeId: action.payload.storeId,
        itemId: action.payload.itemId,
        itemName: action.payload.itemName,
        price: action.payload.price,
        date: new Date().toISOString(),
      };

      // Update mall stats with new price
      const currentStats = state.mallStats[action.payload.mallId] || {
        totalLists: 0,
        totalPriceUpdates: 0,
        averagePrices: {},
        storeStats: {},
        lastUpdate: new Date().toISOString(),
      };

      // Update store-specific price history
      const storeStats = currentStats.storeStats[action.payload.storeId] || {
        totalPriceUpdates: 0,
        averagePrices: {},
      };

      const storePrices =
        storeStats.averagePrices[action.payload.itemName] || [];
      const newStorePrices = [...storePrices, action.payload.price].slice(-5);

      const currentPrices =
        currentStats.averagePrices[action.payload.itemName] || [];
      const newAveragePrices = {
        ...currentStats.averagePrices,
        [action.payload.itemName]: [
          ...currentPrices,
          action.payload.price,
        ].slice(-5),
      };

      return {
        ...state,
        priceHistory: [...state.priceHistory, record],
        malls: state.malls.map((mall) =>
          mall.id === action.payload.mallId
            ? {
                ...mall,
                lastVisited: new Date().toISOString(),
                stores: mall.stores.map((store) =>
                  store.id === action.payload.storeId
                    ? {
                        ...store,
                        lastPriceUpdate: new Date().toISOString(),
                      }
                    : store
                ),
              }
            : mall
        ),
        mallStats: {
          ...state.mallStats,
          [action.payload.mallId]: {
            ...currentStats,
            totalPriceUpdates: currentStats.totalPriceUpdates + 1,
            averagePrices: newAveragePrices,
            storeStats: {
              ...currentStats.storeStats,
              [action.payload.storeId]: {
                ...storeStats,
                totalPriceUpdates: storeStats.totalPriceUpdates + 1,
                averagePrices: {
                  ...storeStats.averagePrices,
                  [action.payload.itemName]: newStorePrices,
                },
              },
            },
            lastUpdate: new Date().toISOString(),
          },
        },
      };

    case MALL_ACTIONS.SET_FAVORITE:
      const { mallId: favoriteMallId, isFavorite } = action.payload;
      return {
        ...state,
        favorites: isFavorite
          ? [...state.favorites, favoriteMallId]
          : state.favorites.filter((id) => id !== favoriteMallId),
      };

    case MALL_ACTIONS.UPDATE_MALL_STATS:
      const mallStats = state.mallStats[action.payload.mallId] || {
        totalLists: 0,
        totalPriceUpdates: 0,
        averagePrices: {},
        lastUpdate: new Date().toISOString(),
      };

      return {
        ...state,
        mallStats: {
          ...state.mallStats,
          [action.payload.mallId]: {
            ...mallStats,
            lastUpdate: new Date().toISOString(),
          },
        },
      };

    case MALL_ACTIONS.UPDATE_LAST_VISITED:
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === action.payload.mallId
            ? { ...mall, lastVisited: new Date().toISOString() }
            : mall
        ),
      };

    case MALL_ACTIONS.ADD_LIST_TO_MALL:
      const currentLists = state.listsByMall[action.payload.mallId] || [];
      const currentMallStats = state.mallStats[action.payload.mallId] || {
        totalLists: 0,
        totalPriceUpdates: 0,
        averagePrices: {},
        lastUpdate: new Date().toISOString(),
      };

      return {
        ...state,
        listsByMall: {
          ...state.listsByMall,
          [action.payload.mallId]: [...currentLists, action.payload.listId],
        },
        mallStats: {
          ...state.mallStats,
          [action.payload.mallId]: {
            ...currentMallStats,
            totalLists: currentMallStats.totalLists + 1,
            lastUpdate: new Date().toISOString(),
          },
        },
      };

    case MALL_ACTIONS.REMOVE_LIST_FROM_MALL:
      const mallLists = state.listsByMall[action.payload.mallId] || [];
      const updatedMallStats = state.mallStats[action.payload.mallId] || {
        totalLists: 0,
        totalPriceUpdates: 0,
        averagePrices: {},
        lastUpdate: new Date().toISOString(),
      };

      return {
        ...state,
        listsByMall: {
          ...state.listsByMall,
          [action.payload.mallId]: mallLists.filter(
            (id) => id !== action.payload.listId
          ),
        },
        mallStats: {
          ...state.mallStats,
          [action.payload.mallId]: {
            ...updatedMallStats,
            totalLists: Math.max(0, updatedMallStats.totalLists - 1),
            lastUpdate: new Date().toISOString(),
          },
        },
      };

    default:
      return state;
  }
}
