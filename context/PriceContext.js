import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { priceReducer } from './priceReducer';
import { initializePriceData } from './actions';
import { loadPersistedState, persistState } from '../utils/persistence';

const initialState = {
  priceHistory: [],
  lastUpdate: null,
};

export const PriceContext = createContext();

export function PriceProvider({ children }) {
  const [state, dispatch] = useReducer(priceReducer, initialState);

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const loadStoredData = async () => {
    try {
      const data = await loadPersistedState('PRICES');
      if (data) {
        dispatch(initializePriceData(data.priceHistory));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveStateToStorage = async () => {
    try {
      await persistState('PRICES', {
        priceHistory: state.priceHistory,
        lastUpdate: state.lastUpdate,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <PriceContext.Provider value={{ state, dispatch }}>
      {children}
    </PriceContext.Provider>
  );
}

export const usePrice = () => useContext(PriceContext);
