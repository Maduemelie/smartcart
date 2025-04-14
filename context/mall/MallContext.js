import { createContext, useContext, useReducer, useEffect } from 'react';
import { mallReducer } from './mallReducer';
import { initializeMallData } from '../actions';
import { loadPersistedState, persistState } from '../../utils/persistence';

const initialState = {
  malls: [],
  priceHistory: [], // Track item prices per mall
  favorites: [], // User's preferred malls
  lastVisited: null,
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
      await persistState('MALLS', state);
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
