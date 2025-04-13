import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { usePrice } from '../context/PriceContext';
import { usePriceAnalytics } from '../hooks/usePriceAnalytics';
import { Colors } from '../constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function Compare() {
  const { state: priceState } = usePrice();
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [selectedItemId] = useState('iphone14pro'); // This would normally come from item selection
  const analytics = usePriceAnalytics(selectedItemId);

  const getChartData = () => {
    const priceData = Object.values(analytics.pricesByMall)
      .flatMap((mall) => mall.priceHistory)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = priceData.map((record) =>
      new Date(record.date).toLocaleDateString()
    );
    const prices = priceData.map((record) => record.price);

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
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Price Comparison',
            headerShadowVisible: false,
          }}
        />

        <ScrollView style={styles.content}>
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
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
                    selectedTimeRange === range && styles.selectedTimeRangeText,
                  ]}
                >
                  {range}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Price Overview Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                iPhone 14 Pro - Price Overview
              </Text>
              {getTrendIcon()}
            </View>

            <View style={styles.priceStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Lowest</Text>
                <Text style={[styles.statValue, { color: Colors.success }]}>
                  ₦{analytics.lowestPrice?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  ₦{analytics.averagePrice?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Highest</Text>
                <Text style={[styles.statValue, { color: Colors.error.main }]}>
                  ₦{analytics.highestPrice?.toLocaleString()}
                </Text>
              </View>
            </View>

            {analytics.priceChangeRate !== 0 && (
              <Text
                style={[
                  styles.priceChange,
                  {
                    color:
                      analytics.priceChangeRate > 0
                        ? Colors.error.main
                        : Colors.success,
                  },
                ]}
              >
                {analytics.priceChangeRate > 0 ? '↑' : '↓'}{' '}
                {Math.abs(analytics.priceChangeRate).toFixed(1)}% from last
                price
              </Text>
            )}
          </View>

          {/* Price History Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Price History</Text>
            <LineChart
              data={getChartData()}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: Colors.surface,
                backgroundGradientFrom: Colors.surface,
                backgroundGradientTo: Colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => Colors.primary,
                labelColor: (opacity = 1) => Colors.text.primary,
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Prices</Text>
            {Object.values(analytics.pricesByMall).map((mallData, index) => (
              <View key={index} style={styles.priceItem}>
                <Text style={styles.mallName}>{mallData.mallName}</Text>
                <Text style={styles.price}>
                  ₦{mallData.currentPrice?.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          {analytics.recommendations.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Price Insights</Text>
              {analytics.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons
                    name="bulb-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.recommendationText}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.text.primary,
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
    color: Colors.text.primary,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
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
    color: Colors.text.secondary,
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
    color: Colors.text.primary,
  },
});
