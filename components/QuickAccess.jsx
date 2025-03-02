import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

const features = [
  {
    icon: 'format-list-bulleted',
    title: 'New List',
    description: 'Create shopping list',
    route: '/list/newList',
  },
  {
    icon: 'store-search',
    title: 'Find Best Prices',
    description: 'Compare mall prices',
    route: '/compare',
  },
  {
    icon: 'history',
    title: 'Recent Lists',
    description: 'View past lists',
    route: '/list/history',
  },
  {
    icon: 'map-marker-multiple',
    title: 'Saved Malls',
    description: 'Manage mall list',
    route: '/malls',
  },
];

export default function QuickAccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {features.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={Colors.text.inverse}
              />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
});
