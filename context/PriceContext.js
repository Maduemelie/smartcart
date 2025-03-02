import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { priceReducer } from './priceReducer';
import { initializePriceData } from './actions';

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
      const prices = await AsyncStorage.getItem('smartcart_prices');
      dispatch(initializePriceData(JSON.parse(prices) || []));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveStateToStorage = async () => {
    try {
      await AsyncStorage.setItem(
        'smartcart_prices',
        JSON.stringify(state.priceHistory)
      );
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
