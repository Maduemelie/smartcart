import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useMall } from '../../context/mall/MallContext';
import { MallLocation } from '../../components/MallLocation';
import { OperatingHours } from '../../components/OperatingHours';
import { StoreManagement } from '../../components/StoreManagement';
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

function StoreList({ stores, onEditStore }) {
  if (!stores || stores.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No stores added yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.storeList}>
      {stores.map((store) => (
        <Pressable
          key={store.id}
          style={({ pressed }) => [
            styles.storeCard,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => onEditStore(store)}
        >
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeCategory}>{store.category}</Text>
            <Text style={styles.storeLocation}>
              {store.floor
                ? `Floor ${store.floor} - ${store.location}`
                : store.location}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.secondary}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function MallDetail() {
  const { id } = useLocalSearchParams();
  const { state } = useMall();
  const [isLoading] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const mall = state.malls.find((m) => m.id === id) || {
    name: 'Unknown Mall',
    address: '',
    hours: {},
    phone: '',
    email: '',
    website: '',
    stores: [],
  };

  const handleAddStore = () => {
    setSelectedStore(null);
    setShowStoreModal(true);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowStoreModal(true);
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
            headerRight: () => (
              <Pressable onPress={handleAddStore} style={styles.addButton}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
              </Pressable>
            ),
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
            <View style={[styles.card, { backgroundColor: Colors.surface }]}>
              <OperatingHours hours={mall.hours} />
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={[styles.card, { backgroundColor: Colors.surface }]}>
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

          {/* Stores Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stores</Text>
              <Pressable onPress={handleAddStore} style={styles.addStoreButton}>
                <Text style={styles.addStoreText}>Add Store</Text>
              </Pressable>
            </View>
            <StoreList stores={mall.stores} onEditStore={handleEditStore} />
          </View>
        </ScrollView>

        <Modal
          visible={showStoreModal}
          animationType="slide"
          onRequestClose={() => setShowStoreModal(false)}
        >
          <StoreManagement
            mallId={id}
            initialStore={selectedStore}
            onClose={() => setShowStoreModal(false)}
          />
        </Modal>
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
  storeList: {
    gap: 12,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  storeLocation: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addStoreButton: {
    padding: 8,
  },
  addStoreText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
