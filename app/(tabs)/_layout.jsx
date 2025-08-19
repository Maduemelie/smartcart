import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import BottomTabs from '../../components/BottomTabs';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="compare" options={{ title: 'Compare' }} />
        <Stack.Screen name="list" options={{ title: 'List' }} />
        <Stack.Screen name="malls" options={{ title: 'Malls' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack>
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});