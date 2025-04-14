import { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsReducer } from './settingsReducer';
import { initializeSettings } from '../actions';
import { loadPersistedState, persistState } from '../../utils/persistence';

const initialState = {
  notifications: {
    priceAlerts: true,
    dealNotifications: true,
    shoppingReminders: false,
  },
  location: {
    useCurrentLocation: true,
    saveSearchedLocations: true,
  },
  language: 'en',
  currency: 'NGN',
  theme: 'system',
  userProfile: {
    name: '',
    email: '',
    location: '',
    avatar: null,
  },
};

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    loadStoredSettings();
  }, []);

  const loadStoredSettings = async () => {
    try {
      const data = await loadPersistedState('SETTINGS');
      if (data) {
        dispatch(initializeSettings(data));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [state]);

  const saveSettings = async () => {
    try {
      await persistState('SETTINGS', {
        notifications: state.notifications,
        location: state.location,
        language: state.language,
        currency: state.currency,
        theme: state.theme,
        userProfile: state.userProfile,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
