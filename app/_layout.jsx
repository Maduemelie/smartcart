import 'react-native-get-random-values';
import React from 'react';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ColorSchemeContext } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import BottomTabs from '../components/BottomTabs';
import { UserProvider, useUser } from '../context/UserContext';
import { ListProvider } from '../context/list/ListContext';
import { MallProvider } from '../context/mall/MallContext';
import { PriceProvider } from '../context/PriceContext';
import { SettingsProvider } from '../context/settings/SettingsContext';
import { ActivityProvider } from '../context/activity/ActivityContext';
import { scheduleAutomaticBackup } from '../utils/backup';
import { hydrateState, clearPersistedState } from '../utils/persistence';
import { LoadingSpinner } from '../components/LoadingSpinner';
import SyncManager from '../utils/sync';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <AppProviders />;
}

function AppProviders() {
  const { colors, colorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialState, setInitialState] = useState(null);
  const [initAttempts, setInitAttempts] = useState(0);

  const initializeApp = async () => {
    try {
      // Load persisted state
      const state = await hydrateState();
      if (!state && initAttempts < 2) {
        // If hydration fails, clear data and try again
        await clearPersistedState();
        setInitAttempts((prev) => prev + 1);
        return;
      }

      setInitialState(state);

      // Initialize sync manager and schedule backup
      await SyncManager.initialize();
      await scheduleAutomaticBackup();
    } catch (error) {
      console.error('Error initializing app:', error);
      if (initAttempts < 2) {
        // Try one more time after clearing data
        await clearPersistedState();
        setInitAttempts((prev) => prev + 1);
      } else {
        Alert.alert(
          'Initialization Error',
          'There was a problem loading your data. The app will start with default settings.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, [initAttempts]);

  if (isLoading) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  return (
    <ColorSchemeContext.Provider value={{ theme: colorScheme, colors }}>
      <UserProvider>
        <ActivityProvider>
          <SettingsProvider initialState={initialState?.settings}>
            <ListProvider initialState={initialState?.lists}>
              <MallProvider initialState={initialState?.malls}>
                <PriceProvider>
                  <AppNavigator />
                  <Toast />
                </PriceProvider>
              </MallProvider>
            </ListProvider>
          </SettingsProvider>
        </ActivityProvider>
      </UserProvider>
    </ColorSchemeContext.Provider>
  );
}

function AppNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // For authenticated users, we show the tab layout which includes bottom tabs
  // For unauthenticated users, we show the auth screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="list/[id]"
            options={{ title: 'List Details', presentation: 'modal' }}
          />
          <Stack.Screen
            name="list/newList"
            options={{ title: 'New List', presentation: 'modal' }}
          />
          <Stack.Screen
            name="list/history"
            options={{ title: 'Purchase History' }}
          />
          <Stack.Screen
            name="mall/[id]"
            options={{ title: 'Store Details' }}
          />
          <Stack.Screen
            name="mall/new"
            options={{ title: 'Add New Store', presentation: 'modal' }}
          />
          <Stack.Screen
            name="mall/edit"
            options={{ title: 'Edit Store' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack>
  );
}