import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mallReducer } from './mallReducer';
import { initializeMallData } from '../actions';

const initialState = {
  malls: [],
  priceHistory: [], // Track item prices per mall
  favorites: [], // User's preferred malls
  lastVisited: null,
};

export const MallContext = createContext();

export function MallProvider({ children }) {
  const [state, dispatch] = useReducer(mallReducer, initialState);

  // Load stored mall data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const mallData = await AsyncStorage.getItem('smartcart_malls');
      if (mallData) {
        dispatch(initializeMallData(JSON.parse(mallData)));
      }
    } catch (error) {
      console.error('Error loading mall data:', error);
    }
  };

  // Save state changes to storage
  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      await AsyncStorage.setItem('smartcart_malls', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving mall data:', error);
    }
  };

  return (
    <MallContext.Provider value={{ state, dispatch }}>
      {children}
    </MallContext.Provider>
  );
}

export const useMall = () => useContext(MallContext);
