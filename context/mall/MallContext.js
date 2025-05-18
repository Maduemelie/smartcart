import { createContext, useContext, useReducer, useEffect } from 'react';
import { mallReducer } from './mallReducer';
import { initializeMallData } from '../actions';
import { loadPersistedState, persistState } from '../../utils/persistence';

const initialState = {
  malls: [],
  priceHistory: [],
  favorites: [],
  lastVisited: null,
  listsByMall: {}, // Track lists associated with each mall
  mallStats: {}, // Track statistics for each mall
};

export const MallContext = createContext();

export function MallProvider({ children }) {
  const [state, dispatch] = useReducer(mallReducer, initialState);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const data = await loadPersistedState('MALLS');
      if (data) {
        dispatch(initializeMallData(data));
      }
    } catch (error) {
      console.error('Error loading mall data:', error);
    }
  };

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      await persistState('MALLS', {
        malls: state.malls,
        priceHistory: state.priceHistory,
        favorites: state.favorites,
        lastVisited: state.lastVisited,
        listsByMall: state.listsByMall,
        mallStats: state.mallStats,
      });
    } catch (error) {
      console.error('Error saving mall data:', error);
    }
  };

  const createMall = (mall) => {
    const mallWithId = {
      ...mall,
      id: mall.id || Date.now().toString(),
    };
    dispatch({ type: 'ADD_MALL', payload: mallWithId });
  };

  const value = {
    state,
    dispatch,
    createMall,
    stats: {
      getTotalLists: (mallId) => state.mallStats[mallId]?.totalLists || 0,
      getPriceUpdates: (mallId) =>
        state.mallStats[mallId]?.totalPriceUpdates || 0,
      getAveragePrice: (mallId, itemName) => {
        const prices = state.mallStats[mallId]?.averagePrices[itemName] || [];
        if (prices.length === 0) return null;
        return prices.reduce((a, b) => a + b, 0) / prices.length;
      },
      getLastUpdate: (mallId) => state.mallStats[mallId]?.lastUpdate,
      getMallLists: (mallId) => state.listsByMall[mallId] || [],
    },
  };

  return <MallContext.Provider value={value}>{children}</MallContext.Provider>;
}

export const useMall = () => useContext(MallContext);
