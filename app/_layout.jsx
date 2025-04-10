import { Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ColorSchemeContext } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import BottomTabs from '../components/BottomTabs';
import { ListProvider } from '../context/list/ListContext';
import { MallProvider } from '../context/mall/MallContext';
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colors, colorScheme } = useColorScheme();

  return (
    <ColorSchemeContext.Provider value={{ theme: colorScheme, colors }}>
      <ListProvider>
        <MallProvider>
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
        </MallProvider>
      </ListProvider>
    </ColorSchemeContext.Provider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return <AppContent />;
}
