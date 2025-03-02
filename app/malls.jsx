import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
// import ScreenLayout from '../components/ScreenLayout';

// Temporary mock data
const MALLS = [
  {
    id: '1',
    name: 'Ikeja City Mall',
    location: 'Ikeja, Lagos',
    distance: '2.5km',
  },
  {
    id: '2',
    name: 'Computer Village',
    location: 'Ikeja, Lagos',
    distance: '3.1km',
  },
  {
    id: '3',
    name: 'Shoprite Mall',
    location: 'Agege, Lagos',
    distance: '0.8km',
  },
];

export default function Malls() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Saved Malls',
          headerRight: () => (
            <Pressable style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {MALLS.map((mall) => (
          <Pressable
            key={mall.id}
            style={({ pressed }) => [
              styles.mallCard,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.mallInfo}>
              <Text style={styles.mallName}>{mall.name}</Text>
              <Text style={styles.mallLocation}>{mall.location}</Text>
            </View>
            <View style={styles.mallActions}>
              <Text style={styles.distance}>{mall.distance}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.secondary}
              />
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
  addButton: {
    padding: 8,
    marginRight: 8,
  },
  mallCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  mallInfo: {
    flex: 1,
  },
  mallName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  mallLocation: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  mallActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    fontSize: 14,
    color: Colors.primary,
  },
});
