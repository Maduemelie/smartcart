import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen'; // Now imported from expo-router
import { ColorSchemeContext } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
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

// The root layout must be the default export.
// It's responsible for setting up providers and rendering the navigator.
export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}

function AppProviders({ children }) {
  const { colors, colorScheme } = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Attempt to load persisted state
        const state = await hydrateState();
        setInitialState(state);

        // Initialize background services
        await SyncManager.initialize();
        await scheduleAutomaticBackup();
      } catch (error) {
        console.error(
          'Error initializing app, clearing state and starting fresh:',
          error
        );
        // If hydration fails for any reason, clear all data and start fresh.
        await clearPersistedState();
        setInitialState(null); // Ensure we start with a clean slate
        Alert.alert(
          'Initialization Error',
          'There was a problem loading your data. The app will start with default settings.',
          [{ text: 'OK' }]
        );
      } finally {
        // Mark the app as ready to render
        setIsAppReady(true);
      }
    }

    initializeApp();
  }, []); // This effect should only run once on mount

  if (!isAppReady) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  return (
    <ColorSchemeContext.Provider value={{ theme: colorScheme, colors }}>
      <UserProvider>
        <ActivityProvider>
          <SettingsProvider initialState={initialState?.settings || {}}>
            <ListProvider initialState={initialState?.lists || {}}>
              <MallProvider initialState={initialState?.malls || {}}>
                <PriceProvider>
                  {/* The Toast component uses a portal, so it can be a sibling to the navigator */}
                  <>
                    {children}
                    <Toast />
                  </>
                </PriceProvider>
              </MallProvider>
            </ListProvider>
          </SettingsProvider>
        </ActivityProvider>
      </UserProvider>
    </ColorSchemeContext.Provider>
  );
}

function RootLayoutNav() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? ( // User is authenticated
        <Stack.Screen name="(tabs)" key="app-tabs" />
      ) : (
        // User is not authenticated
        <Stack.Screen name="(auth)" key="app-auth" />
      )}
    </Stack>
  );
}
