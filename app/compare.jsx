import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';
import { useMall } from '../context/mall/MallContext';

export default function Compare() {
  const { colors } = useColorScheme();
  const { state: mallState } = useMall();

  const getStorePrices = (itemName) => {
    const storePrices = {};
    mallState.malls.forEach((store) => {
      const storeStats = mallState.mallStats[store.id];
      if (storeStats?.averagePrices[itemName]) {
        const prices = storeStats.averagePrices[itemName];
        storePrices[store.id] = {
          name: store.name,
          price: prices[prices.length - 1], // Get most recent price
          avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        };
      }
    });
    return storePrices;
  };

  const getBestPrice = (prices) => {
    return Object.values(prices).reduce(
      (min, curr) => (curr.price < min ? curr.price : min),
      Number.MAX_VALUE
    );
  };

  const renderPriceComparison = (itemName) => {
    const storePrices = getStorePrices(itemName);
    if (Object.keys(storePrices).length === 0) return null;

    const bestPrice = getBestPrice(storePrices);

    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          {itemName}
        </Text>
        <View style={styles.priceContainer}>
          {Object.entries(storePrices).map(([storeId, data]) => (
            <View key={storeId} style={styles.priceItem}>
              <Text
                style={[styles.storeName, { color: colors.text.secondary }]}
              >
                {data.name}
              </Text>
              <Text
                style={[
                  styles.price,
                  {
                    color:
                      data.price === bestPrice
                        ? colors.success
                        : colors.text.primary,
                  },
                ]}
              >
                ₦{data.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        {Object.keys(storePrices).length > 1 && (
          <Text style={[styles.savings, { color: colors.success }]}>
            Potential Savings: ₦
            {(
              Math.max(...Object.values(storePrices).map((d) => d.price)) -
              bestPrice
            ).toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  // Get unique item names from price history
  const uniqueItems = Array.from(
    new Set(mallState.priceHistory.map((record) => record.itemName))
  ).sort();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Compare Prices',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
        }}
      />

      <ScrollView style={styles.content}>
        {uniqueItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No price data available yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.text.secondary }]}
            >
              Price data will appear here as you make purchases
            </Text>
          </View>
        ) : (
          uniqueItems.map((itemName) => renderPriceComparison(itemName))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceContainer: {
    marginVertical: 8,
    gap: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  storeName: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  savings: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
