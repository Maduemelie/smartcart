import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mallReducer } from './mallReducer';
import { initializeMallData } from './actions';

const initialState = {
  list: [],
  activeMall: null,
};

export const MallContext = createContext();

export function MallProvider({ children }) {
  const [state, dispatch] = useReducer(mallReducer, initialState);

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const loadStoredData = async () => {
    try {
      const malls = await AsyncStorage.getItem('smartcart_malls');
      dispatch(initializeMallData(JSON.parse(malls) || []));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveStateToStorage = async () => {
    try {
      await AsyncStorage.setItem('smartcart_malls', JSON.stringify(state.list));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <MallContext.Provider value={{ state, dispatch }}>
      {children}
    </MallContext.Provider>
  );
}

export const useMall = () => useContext(MallContext);
