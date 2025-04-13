import { useState, useEffect } from 'react';
import { useDataFetching } from './useDataFetching';
import CacheManager from '../utils/cache';

export function usePriceAnalytics(itemId) {
  const [analytics, setAnalytics] = useState({
    lowestPrice: null,
    highestPrice: null,
    averagePrice: null,
    priceChangeRate: 0,
    trendDirection: 'stable',
    pricesByMall: {},
    recommendations: [],
  });

  const { data: priceHistory, loading } = useDataFetching(
    `price_history_${itemId}`,
    async () => {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      const mockPriceHistory = {
        mallA: {
          mallName: 'Mall A',
          currentPrice: 850000,
          priceHistory: [
            { date: '2025-01-01', price: 900000 },
            { date: '2025-02-01', price: 875000 },
            { date: '2025-03-01', price: 850000 },
          ],
        },
        mallB: {
          mallName: 'Mall B',
          currentPrice: 865000,
          priceHistory: [
            { date: '2025-01-01', price: 890000 },
            { date: '2025-02-01', price: 880000 },
            { date: '2025-03-01', price: 865000 },
          ],
        },
      };
      return mockPriceHistory;
    },
    {
      ttl: 1000 * 60 * 15, // 15 minutes cache
    }
  );

  useEffect(() => {
    if (!priceHistory || loading) return;

    const analyzePrices = () => {
      const allPrices = Object.values(priceHistory).flatMap((mall) =>
        mall.priceHistory.map((record) => record.price)
      );

      const currentPrices = Object.values(priceHistory).map(
        (mall) => mall.currentPrice
      );

      const lowest = Math.min(...allPrices);
      const highest = Math.max(...allPrices);
      const average = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

      // Calculate price change rate from previous month
      const previousPrices = Object.values(priceHistory).map((mall) => {
        const sortedHistory = [...mall.priceHistory].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        return sortedHistory[1]?.price || sortedHistory[0]?.price;
      });

      const avgCurrentPrice =
        currentPrices.reduce((a, b) => a + b, 0) / currentPrices.length;
      const avgPreviousPrice =
        previousPrices.reduce((a, b) => a + b, 0) / previousPrices.length;
      const priceChangeRate =
        ((avgCurrentPrice - avgPreviousPrice) / avgPreviousPrice) * 100;

      // Determine trend
      let trendDirection = 'stable';
      if (priceChangeRate > 1) {
        trendDirection = 'rising';
      } else if (priceChangeRate < -1) {
        trendDirection = 'falling';
      }

      // Generate recommendations
      const recommendations = [];
      const lowestCurrentPrice = Math.min(...currentPrices);
      const highestCurrentPrice = Math.max(...currentPrices);
      const priceDifference = highestCurrentPrice - lowestCurrentPrice;

      if (priceDifference > 0) {
        const savingsPercent = (
          (priceDifference / highestCurrentPrice) *
          100
        ).toFixed(1);
        recommendations.push(
          `You can save ${savingsPercent}% by buying from the cheapest mall.`
        );
      }

      if (trendDirection === 'rising') {
        recommendations.push(
          'Prices are trending upward. Consider buying soon.'
        );
      } else if (trendDirection === 'falling') {
        recommendations.push(
          'Prices are falling. You might want to wait for better deals.'
        );
      }

      setAnalytics({
        lowestPrice: lowest,
        highestPrice: highest,
        averagePrice: Math.round(average),
        priceChangeRate,
        trendDirection,
        pricesByMall: priceHistory,
        recommendations,
      });
    };

    analyzePrices();
  }, [priceHistory, loading]);

  useEffect(() => {
    // Cache analytics for offline access
    if (analytics.lowestPrice !== null) {
      CacheManager.set(`price_analytics_${itemId}`, analytics, 1000 * 60 * 60); // 1 hour cache
    }
  }, [analytics, itemId]);

  return analytics;
}
