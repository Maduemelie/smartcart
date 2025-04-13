import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ColorSchemeContext } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import BottomTabs from '../components/BottomTabs';
import { ListProvider } from '../context/list/ListContext';
import { MallProvider } from '../context/mall/MallContext';
import { SettingsProvider } from '../context/settings/SettingsContext';
import { PriceProvider } from '../context/PriceContext';
import { scheduleAutomaticBackup } from '../utils/backup';
import { hydrateState } from '../utils/persistence';
import { checkAndMigrateData } from '../utils/migration';
import { LoadingSpinner } from '../components/LoadingSpinner';
import SyncManager from '../utils/sync';

SplashScreen.preventAutoHideAsync();

export default function AppContent() {
  const { colors, colorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check and perform any necessary data migrations
        await checkAndMigrateData();

        // Load persisted state
        const state = await hydrateState();
        setInitialState(state);

        // Initialize sync manager and schedule backup
        await SyncManager.initialize();
        await scheduleAutomaticBackup();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  return (
    <ColorSchemeContext.Provider value={{ theme: colorScheme, colors }}>
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
                  <Stack.Screen
                    name="index"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="list"
                    options={{
                      title: 'Shopping Lists',
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="list/history"
                    options={{
                      title: 'Recent Lists',
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="list/newList"
                    options={{
                      title: 'New Shopping List',
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="compare"
                    options={{
                      title: 'Compare Prices',
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="malls"
                    options={{
                      title: 'Saved Malls',
                      animation: 'slide_from_right',
                    }}
                  />
                  <Stack.Screen
                    name="profile"
                    options={{
                      title: 'Profile',
                      animation: 'slide_from_right',
                      headerShown: false,
                    }}
                  />
                </Stack>
                <BottomTabs />
              </View>
            </PriceProvider>
          </MallProvider>
        </ListProvider>
      </SettingsProvider>
    </ColorSchemeContext.Provider>
  );
}
