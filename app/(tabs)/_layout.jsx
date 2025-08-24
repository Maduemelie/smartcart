import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const { colors } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      />

      {/* Shopping Lists Tab */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" color={color} size={24} />
          ),
        }}
      />

      {/* Stores / Malls Tab */}
      <Tabs.Screen
        name="malls"
        options={{
          title: 'Stores',
          tabBarIcon: ({ color }) => (
            <Ionicons name="storefront-outline" color={color} size={24} />
          ),
        }}
      />

      {/* Product Comparison Tab */}
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Compare',
          tabBarIcon: ({ color }) => (
            <Ionicons name="git-compare-outline" color={color} size={24} />
          ),
        }}
      />

      {/* User Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />

      {/* Hidden Tabs */}
      <Tabs.Screen name="list/history" options={{ href: null }} />
      <Tabs.Screen name="list/newList" options={{ href: null }} />
      <Tabs.Screen name="list/[id]" options={{ href: null }} />
      <Tabs.Screen name="mall/new" options={{ href: null }} />
      <Tabs.Screen name="mall/edit" options={{ href: null }} />
      <Tabs.Screen name="mall/[id]" options={{ href: null }} />
    </Tabs>
  );
}
