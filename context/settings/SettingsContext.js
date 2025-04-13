import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsReducer } from './settingsReducer';
import { initializeSettings } from '../actions';

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
      const [settingsData, profileData] = await Promise.all([
        AsyncStorage.getItem('user_settings'),
        AsyncStorage.getItem('user_profile'),
      ]);

      const settings = settingsData ? JSON.parse(settingsData) : initialState;
      const profile = profileData
        ? JSON.parse(profileData)
        : initialState.userProfile;

      dispatch(initializeSettings({ ...settings, userProfile: profile }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [state]);

  const saveSettings = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          'user_settings',
          JSON.stringify({
            notifications: state.notifications,
            location: state.location,
            language: state.language,
            currency: state.currency,
            theme: state.theme,
          })
        ),
        AsyncStorage.setItem('user_profile', JSON.stringify(state.userProfile)),
      ]);
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
