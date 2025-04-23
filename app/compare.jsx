import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { usePrice } from '../context/PriceContext';
import { useMall } from '../context/mall/MallContext';
import { Colors } from '../constants/Colors';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useColorScheme } from '../hooks/useColorScheme';

export default function Compare() {
  const { colors } = useColorScheme();
  const { state: priceState } = usePrice();
  const { state: mallState } = useMall();
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique items from price history
  const uniqueItems = useMemo(() => {
    const items = new Set();
    priceState.priceHistory.forEach((record) => {
      items.add(record.itemName);
    });
    return Array.from(items);
  }, [priceState.priceHistory]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return uniqueItems.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueItems, searchQuery]);

  const [selectedItem, setSelectedItem] = useState(null);

  // Calculate analytics for selected item
  const analytics = useMemo(() => {
    if (!selectedItem) return null;

    const itemRecords = priceState.priceHistory.filter(
      (record) => record.itemName === selectedItem
    );

    // Calculate date range based on selected time range
    const now = new Date();
    let startDate = new Date();
    switch (selectedTimeRange) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Filter records within date range
    const filteredRecords = itemRecords.filter(
      (record) => new Date(record.date) >= startDate
    );

    // Group by mall
    const pricesByMall = {};
    filteredRecords.forEach((record) => {
      const mall = mallState.malls.find((m) => m.id === record.mallId);
      if (mall) {
        if (!pricesByMall[mall.id]) {
          pricesByMall[mall.id] = {
            mallName: mall.name,
            priceHistory: [],
            currentPrice: null,
          };
        }
        pricesByMall[mall.id].priceHistory.push({
          date: record.date,
          price: record.price,
        });
      }
    });

    // Set current prices and sort history
    Object.values(pricesByMall).forEach((mall) => {
      mall.priceHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
      mall.currentPrice =
        mall.priceHistory[mall.priceHistory.length - 1]?.price;
    });

    // Calculate statistics
    const allPrices = filteredRecords.map((r) => r.price);
    const lowestPrice = Math.min(...allPrices);
    const highestPrice = Math.max(...allPrices);
    const averagePrice =
      allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

    // Calculate trend
    const recentPrices = filteredRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((r) => r.price);

    let trendDirection = 'stable';
    if (recentPrices.length >= 2) {
      const priceChange =
        ((recentPrices[0] - recentPrices[recentPrices.length - 1]) /
          recentPrices[recentPrices.length - 1]) *
        100;
      trendDirection =
        priceChange > 1 ? 'rising' : priceChange < -1 ? 'falling' : 'stable';
    }

    // Generate recommendations
    const recommendations = [];
    const lowestPriceMall = Object.entries(pricesByMall).reduce((a, b) =>
      (a[1].currentPrice || Infinity) < (b[1].currentPrice || Infinity) ? a : b
    )[1];

    if (lowestPriceMall) {
      recommendations.push(
        `Best price available at ${lowestPriceMall.mallName}`
      );
    }

    if (trendDirection === 'falling') {
      recommendations.push('Prices are trending down. Good time to buy!');
    } else if (trendDirection === 'rising') {
      recommendations.push('Prices are rising. Consider buying soon.');
    }

    return {
      lowestPrice,
      highestPrice,
      averagePrice,
      trendDirection,
      pricesByMall,
      recommendations,
    };
  }, [
    selectedItem,
    selectedTimeRange,
    priceState.priceHistory,
    mallState.malls,
  ]);

  const getChartData = () => {
    if (!analytics)
      return {
        labels: [],
        datasets: [{ data: [0] }],
      };

    const allRecords = Object.values(analytics.pricesByMall)
      .flatMap((mall) => mall.priceHistory)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = allRecords.map((record) =>
      new Date(record.date).toLocaleDateString()
    );
    const prices = allRecords.map((record) => record.price);

    return {
      labels,
      datasets: [
        {
          data: prices.length > 0 ? prices : [0],
        },
      ],
    };
  };

  const getTrendIcon = () => {
    if (!analytics) return null;

    switch (analytics.trendDirection) {
      case 'rising':
        return (
          <Ionicons name="trending-up" size={24} color={Colors.error.main} />
        );
      case 'falling':
        return (
          <Ionicons name="trending-down" size={24} color={Colors.success} />
        );
      default:
        return (
          <Ionicons name="remove" size={24} color={Colors.text.secondary} />
        );
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen
          options={{
            title: 'Price Comparison',
            headerShadowVisible: false,
          }}
        />

        <ScrollView style={styles.content}>
          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Search items..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {!selectedItem ? (
            // Item Selection View
            <View style={styles.itemList}>
              {filteredItems.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.itemCard, { backgroundColor: colors.surface }]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text
                    style={[styles.itemName, { color: colors.text.primary }]}
                  >
                    {item}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text.secondary}
                  />
                </Pressable>
              ))}
              {filteredItems.length === 0 && (
                <View style={styles.emptyState}>
                  <Text
                    style={[styles.emptyText, { color: colors.text.secondary }]}
                  >
                    {searchQuery
                      ? 'No items match your search'
                      : 'No price data available'}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            // Price Analysis View
            <>
              <Pressable
                style={styles.backButton}
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.text.primary}
                />
                <Text
                  style={[
                    styles.backButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  Back to Items
                </Text>
              </Pressable>

              <Text
                style={[styles.selectedItem, { color: colors.text.primary }]}
              >
                {selectedItem}
              </Text>

              {/* Time Range Selector */}
              <View
                style={[
                  styles.timeRangeContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                {['1W', '1M', '3M', '6M', '1Y'].map((range) => (
                  <Pressable
                    key={range}
                    style={[
                      styles.timeRangeButton,
                      selectedTimeRange === range && styles.selectedTimeRange,
                    ]}
                    onPress={() => setSelectedTimeRange(range)}
                  >
                    <Text
                      style={[
                        styles.timeRangeText,
                        selectedTimeRange === range &&
                          styles.selectedTimeRangeText,
                      ]}
                    >
                      {range}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {analytics && (
                <>
                  {/* Price Overview Card */}
                  <View
                    style={[styles.card, { backgroundColor: colors.surface }]}
                  >
                    <View style={styles.cardHeader}>
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        Price Overview
                      </Text>
                      {getTrendIcon()}
                    </View>

                    <View style={styles.priceStats}>
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Lowest
                        </Text>
                        <Text
                          style={[styles.statValue, { color: Colors.success }]}
                        >
                          ₦{analytics.lowestPrice?.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Average
                        </Text>
                        <Text
                          style={[
                            styles.statValue,
                            { color: colors.text.primary },
                          ]}
                        >
                          ₦{analytics.averagePrice?.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Highest
                        </Text>
                        <Text
                          style={[
                            styles.statValue,
                            { color: Colors.error.main },
                          ]}
                        >
                          ₦{analytics.highestPrice?.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Price History Chart */}
                  <View
                    style={[styles.card, { backgroundColor: colors.surface }]}
                  >
                    <Text
                      style={[styles.cardTitle, { color: colors.text.primary }]}
                    >
                      Price History
                    </Text>
                    <LineChart
                      data={getChartData()}
                      width={Dimensions.get('window').width - 64}
                      height={220}
                      chartConfig={{
                        backgroundColor: colors.surface,
                        backgroundGradientFrom: colors.surface,
                        backgroundGradientTo: colors.surface,
                        decimalPlaces: 0,
                        color: (opacity = 1) => Colors.primary,
                        labelColor: (opacity = 1) => colors.text.secondary,
                        style: {
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: '6',
                          strokeWidth: '2',
                          stroke: Colors.primary,
                        },
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </View>

                  {/* Current Prices by Mall */}
                  <View
                    style={[styles.card, { backgroundColor: colors.surface }]}
                  >
                    <Text
                      style={[styles.cardTitle, { color: colors.text.primary }]}
                    >
                      Current Prices
                    </Text>
                    {Object.values(analytics.pricesByMall).map(
                      (mallData, index) => (
                        <View key={index} style={styles.priceItem}>
                          <Text
                            style={[
                              styles.mallName,
                              { color: colors.text.primary },
                            ]}
                          >
                            {mallData.mallName}
                          </Text>
                          <Text style={styles.price}>
                            ₦{mallData.currentPrice?.toLocaleString()}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  {/* Recommendations */}
                  {analytics.recommendations.length > 0 && (
                    <View
                      style={[styles.card, { backgroundColor: colors.surface }]}
                    >
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        Price Insights
                      </Text>
                      {analytics.recommendations.map(
                        (recommendation, index) => (
                          <View key={index} style={styles.recommendationItem}>
                            <Ionicons
                              name="bulb-outline"
                              size={20}
                              color={Colors.primary}
                            />
                            <Text
                              style={[
                                styles.recommendationText,
                                { color: colors.text.primary },
                              ]}
                            >
                              {recommendation}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  itemList: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
  },
  selectedItem: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedTimeRange: {
    backgroundColor: Colors.primary,
  },
  timeRangeText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTimeRangeText: {
    color: Colors.text.inverse,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  priceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  mallName: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
  },
});
