import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from '../hooks/useColorScheme';

const { width } = Dimensions.get('window');

/**
 * PriceChart component for visualizing price trends over time
 *
 * @param {Object} props
 * @param {Array} props.priceData - Array of price records with date and price
 * @param {string} props.itemName - Name of the item
 * @param {Array} props.stores - Array of store objects with id and name
 */
export default function PriceChart({ priceData, itemName, stores = [] }) {
  const { colors } = useColorScheme();

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) {
      return null;
    }

    // Group price data by store
    const storeData = {};

    // Initialize store data
    stores.forEach((store) => {
      storeData[store.id] = {
        name: store.name,
        prices: [],
        dates: [],
        color: getRandomColor(store.id),
      };
    });

    // Populate store data with prices
    priceData.forEach((record) => {
      if (storeData[record.mallId]) {
        storeData[record.mallId].prices.push(parseFloat(record.price));
        storeData[record.mallId].dates.push(new Date(record.date));
      }
    });

    // Format data for the chart
    const datasets = [];
    const labels = [];
    const allDates = new Set();

    // Collect all unique dates
    Object.values(storeData).forEach((store) => {
      store.dates.forEach((date) => {
        allDates.add(date.toISOString().split('T')[0]);
      });
    });

    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort();

    // Use the last 6 dates or fewer if not enough data
    const displayDates = sortedDates.slice(-6);

    // Create labels from dates
    displayDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    });

    // Create datasets for each store
    Object.values(storeData).forEach((store) => {
      if (store.prices.length > 0) {
        // Map prices to display dates
        const data = displayDates.map((dateStr) => {
          const index = store.dates.findIndex(
            (d) => d.toISOString().split('T')[0] === dateStr
          );
          return index !== -1 ? store.prices[index] : null;
        });

        // Filter out null values and their corresponding dates
        const filteredData = [];
        const filteredLabels = [];

        data.forEach((price, i) => {
          if (price !== null) {
            filteredData.push(price);
            filteredLabels.push(labels[i]);
          }
        });

        if (filteredData.length > 0) {
          datasets.push({
            data: filteredData,
            color: () => store.color,
            strokeWidth: 2,
            name: store.name,
          });
        }
      }
    });

    return {
      labels: labels,
      datasets: datasets,
      legend: datasets.map((d) => d.name),
    };
  }, [priceData, stores]);

  // Generate a consistent color based on store ID
  function getRandomColor(id) {
    const colors = [
      '#FF6384', // Red
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#2ECC71', // Green
    ];

    // Use the sum of character codes in the ID to pick a color
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  }

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.noDataText, { color: colors.text.secondary }]}>
          Not enough price data to display chart
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Price History: {itemName}
      </Text>

      <LineChart
        data={chartData}
        width={width - 40}
        height={220}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.text.primary,
          labelColor: (opacity = 1) => colors.text.secondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
          },
        }}
        bezier
        style={styles.chart}
        fromZero
        yAxisLabel="₦"
        yAxisSuffix=""
        renderDotContent={({ x, y, index, indexData, dataset }) => (
          <View
            key={`${dataset.name}-${index}`}
            style={[
              styles.tooltip,
              {
                left: x - 20,
                top: y - 28,
                backgroundColor: dataset.color(),
              },
            ]}
          >
            <Text style={styles.tooltipText}>₦{indexData}</Text>
          </View>
        )}
        legend={chartData.legend}
      />

      <View style={styles.legend}>
        {chartData.datasets.map((dataset, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: dataset.color() }]}
            />
            <Text style={[styles.legendText, { color: colors.text.secondary }]}>
              {dataset.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tooltipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
