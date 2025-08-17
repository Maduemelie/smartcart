import 'react-native-get-random-values';
import React from 'react';
import { Stack, router, Redirect } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ColorSchemeContext } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import BottomTabs from '../components/BottomTabs';
import { UserProvider, useUser } from '@/context/UserContext';
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
  return (
    <UserProvider>
      <SettingsProvider>
        <ActivityProvider>
          <ListProvider>
            <MallProvider>
              <PriceProvider>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="signup"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="profile" options={{ title: 'Profile' }} />
                  <Stack.Screen
                    name="list"
                    options={{ title: 'Shopping Lists' }}
                  />
                  <Stack.Screen
                    name="list/[id]"
                    options={{ title: 'List Details' }}
                  />
                  <Stack.Screen
                    name="list/newList"
                    options={{ title: 'New List' }}
                  />
                  <Stack.Screen
                    name="list/history"
                    options={{ title: 'Purchase History' }}
                  />
                  <Stack.Screen name="malls" options={{ title: 'Stores' }} />
                  <Stack.Screen
                    name="mall/[id]"
                    options={{ title: 'Store Details' }}
                  />
                  <Stack.Screen
                    name="mall/new"
                    options={{ title: 'Add New Store' }}
                  />
                  <Stack.Screen
                    name="mall/edit"
                    options={{ title: 'Edit Store' }}
                  />
                  <Stack.Screen
                    name="compare"
                    options={{ title: 'Price Comparison' }}
                  />
                </Stack>
              </PriceProvider>
            </MallProvider>
          </ListProvider>
        </ActivityProvider>
      </SettingsProvider>
    </UserProvider>
  );
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
                  <View style={{ flex: 1 }}>
                    <Stack
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: colors.background,
                        },
                        headerTintColor: colors.text.primary,
                        headerTitleStyle: {
                          color: colors.text.primary,
                          fontWeight: 'bold',
                        },
                        contentStyle: {
                          backgroundColor: colors.background,
                        },
                      }}
                    >
                      {/* This will render screens from (app) or (auth) group */}
                      <Stack.Screen
                        name="(app)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="login"
                        options={{ headerShown: false, presentation: 'modal' }}
                      />
                      <Stack.Screen
                        name="signup"
                        options={{ headerShown: false, presentation: 'modal' }}
                      />
                    </Stack>
                    {/* We only show BottomTabs if the user is authenticated */}
                    <RootLayoutNav />
                  </View>
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

function RootLayoutNav() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (user) {
    return (
      <>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <BottomTabs />
      </>
    );
  }

  return (
    <>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </>
  );
}
