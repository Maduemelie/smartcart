import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useMall } from '../context/mall/MallContext';
import { setMallFavorite } from '../context/actions';

export default function Malls() {
  const { state, dispatch } = useMall();
  const { malls, favorites } = state;

  const handleAddMall = () => {
    router.push('/mall/new');
  };

  const handlePressMall = (mallId) => {
    router.push(`/mall/${mallId}`);
  };

  const toggleFavorite = (mallId) => {
    const isFavorite = favorites.includes(mallId);
    dispatch(setMallFavorite(mallId, !isFavorite));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Saved Malls',
          headerRight: () => (
            <Pressable onPress={handleAddMall} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.content}>
        {malls.map((mall) => (
          <Pressable
            key={mall.id}
            style={({ pressed }) => [
              styles.mallCard,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => handlePressMall(mall.id)}
          >
            <View style={styles.mallInfo}>
              <Text style={styles.mallName}>{mall.name}</Text>
              <Text style={styles.mallLocation}>
                {mall.location || 'No location set'}
              </Text>
              {mall.lastVisited && (
                <Text style={styles.lastVisited}>
                  Last visited:{' '}
                  {new Date(mall.lastVisited).toLocaleDateString()}
                </Text>
              )}
            </View>
            <View style={styles.mallActions}>
              <Pressable
                onPress={() => toggleFavorite(mall.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorites.includes(mall.id) ? 'star' : 'star-outline'}
                  size={20}
                  color={Colors.primary}
                />
              </Pressable>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.secondary}
              />
            </View>
          </Pressable>
        ))}

        {malls.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No malls saved yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add malls to track prices and shopping history
            </Text>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  lastVisited: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
