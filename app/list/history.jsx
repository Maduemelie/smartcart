import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
// import ScreenLayout from '../../components/ScreenLayout';

// Temporary mock data
const RECENT_LISTS = [
  {
    id: '1',
    name: 'Weekly Groceries',
    date: '2 days ago',
    items: 8,
    totalAmount: '₦45,000',
    mall: 'Shoprite Mall',
  },
  {
    id: '2',
    name: 'Electronics',
    date: '5 days ago',
    items: 3,
    totalAmount: '₦350,000',
    mall: 'Computer Village',
  },
];

export default function ListHistory() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shopping History',
          headerLeft: () => (
            <Pressable style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.text.primary}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {RECENT_LISTS.map((list) => (
          <Pressable
            key={list.id}
            style={({ pressed }) => [
              styles.historyCard,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.date}>{list.date}</Text>
            </View>
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Ionicons name="list" size={16} color={Colors.text.secondary} />
                <Text style={styles.detailText}>{list.items} items</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons
                  name="location"
                  size={16}
                  color={Colors.text.secondary}
                />
                <Text style={styles.detailText}>{list.mall}</Text>
              </View>
              <Text style={styles.amount}>{list.totalAmount}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  historyCard: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  date: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
