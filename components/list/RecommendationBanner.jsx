import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';

export const RecommendationBanner = ({ recommendation, isLoading, error }) => {
  const { colors } = useColorScheme();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginTop: 16,
          },
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Finding the best store for you...
        </Text>
      </View>
    );
  }

  if (error || !recommendation) {
    // Don't show anything if there's an error or no recommendation
    return null;
  }

  const { topStore, details } = recommendation;
  const { itemsFound, totalItems, bestPriceFor } = details;

  const bestPriceString =
    bestPriceFor && bestPriceFor.length > 0
      ? ` and has the best price for ${bestPriceFor.join(' and ')}.`
      : '.';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary + '15',
          marginHorizontal: 16,
          marginTop: 16,
        },
      ]}
    >
      <Ionicons name="bulb-outline" size={24} color={colors.primary} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>
          We recommend shopping at {topStore.name}.
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          You've previously found {itemsFound}/{totalItems} items there
          {bestPriceString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  loadingText: { fontSize: 14, fontStyle: 'italic' },
});
