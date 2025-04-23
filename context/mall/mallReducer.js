import { MALL_ACTIONS } from '../actions';

export function mallReducer(state, action) {
  switch (action.type) {
    case MALL_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        malls: action.payload.malls || [],
        priceHistory: action.payload.priceHistory || [],
        favorites: action.payload.favorites || [],
        lastVisited: action.payload.lastVisited || [],
        listsByMall: action.payload.listsByMall || {},
        mallStats: action.payload.mallStats || {},
      };

    case MALL_ACTIONS.ADD_MALL:
      return {
        ...state,
        malls: [...state.malls, action.payload],
        mallStats: {
          ...state.mallStats,
          [action.payload.id]: {
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
            ? { ...mall, ...action.payload.mall }
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

    case MALL_ACTIONS.ADD_PRICE_RECORD:
      const { mallId, itemId, itemName, price } = action.payload;
      const currentStats = state.mallStats[mallId] || {
        totalPriceUpdates: 0,
        averagePrices: {},
      };
      const currentPrices = currentStats.averagePrices[itemName] || [];
      const newPrices = [...currentPrices, price];

      return {
        ...state,
        priceHistory: [
          ...state.priceHistory,
          {
            ...action.payload,
            date: new Date().toISOString(),
          },
        ],
        mallStats: {
          ...state.mallStats,
          [mallId]: {
            ...currentStats,
            totalPriceUpdates: currentStats.totalPriceUpdates + 1,
            averagePrices: {
              ...currentStats.averagePrices,
              [itemName]: newPrices,
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
            (listId) => listId !== action.payload.listId
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
