import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useMall } from '../../context/mall/MallContext';
import { MallLocation } from '../../components/MallLocation';
import { Colors } from '../../constants/Colors';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/LoadingSpinner';

function BusinessHours({ hours }) {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const today = new Date().getDay();
  const adjustedDay = today === 0 ? 6 : today - 1;

  return (
    <View style={styles.hoursContainer}>
      {days.map((day, index) => (
        <View
          key={day}
          style={[styles.hourRow, adjustedDay === index && styles.todayRow]}
        >
          <Text
            style={[styles.dayText, adjustedDay === index && styles.todayText]}
          >
            {day}
          </Text>
          <Text
            style={[styles.timeText, adjustedDay === index && styles.todayText]}
          >
            {hours?.[day.toLowerCase()] || 'Closed'}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function MallDetail() {
  const { id } = useLocalSearchParams();
  const { state } = useMall();
  const [isLoading] = useState(false);

  const mall = state.malls.find((m) => m.id === id) || {
    name: 'Unknown Mall',
    address: '',
    hours: {},
    phone: '',
    email: '',
    website: '',
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: mall.name,
            headerTitleStyle: { fontSize: 18 },
          }}
        />

        <ScrollView style={styles.content}>
          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MallLocation mall={mall} />
          </View>

          {/* Business Hours Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.card}>
              <BusinessHours hours={mall.hours} />
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.card}>
              {mall.phone && (
                <Pressable style={styles.contactItem}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.contactText}>{mall.phone}</Text>
                </Pressable>
              )}

              {mall.email && (
                <Pressable style={styles.contactItem}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.contactText}>{mall.email}</Text>
                </Pressable>
              )}

              {mall.website && (
                <Pressable style={styles.contactItem}>
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.contactText}>{mall.website}</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Recent Price Updates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Price Updates</Text>
            <View style={styles.card}>
              {state.priceHistory
                .filter((record) => record.mallId === id)
                .slice(0, 5)
                .map((record, index) => (
                  <View key={index} style={styles.priceUpdateItem}>
                    <Text style={styles.itemName}>Item Name</Text>
                    <Text style={styles.priceText}>₦{record.price}</Text>
                    <Text style={styles.updateDate}>
                      {new Date(record.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  hoursContainer: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  todayRow: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dayText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  contactText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  priceUpdateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  priceText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  updateDate: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
