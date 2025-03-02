import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

export default function Compare() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Price Comparison Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>iPhone 14 Pro</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.mallName}>Ikeja Mall</Text>
              <Text style={styles.price}>₦850,000</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.mallName}>Computer Village</Text>
              <Text style={styles.price}>₦820,000</Text>
            </View>
          </View>
          <Text style={styles.savings}>Potential Savings: ₦30,000</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  priceContainer: {
    marginVertical: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
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
  savings: {
    marginTop: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
});
