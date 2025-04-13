import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../context/list/ListContext';
import { useMall } from '../context/mall/MallContext';
import { Colors } from '../constants/Colors';

export default function QuickAccess() {
  const { state: listState } = useList();
  const { state: mallState } = useMall();

  const recentLists = listState.lists
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
    .slice(0, 3);

  const favoriteMalls = mallState.malls
    .filter((mall) => mallState.favorites.includes(mall.id))
    .slice(0, 3);

  const handleListPress = (listId) => {
    router.push(`/list/${listId}`);
  };

  const handleMallPress = (mallId) => {
    router.push(`/mall/${mallId}`);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Recent Lists */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Lists</Text>
        <View style={styles.itemsContainer}>
          {recentLists.map((list) => (
            <Pressable
              key={list.id}
              style={styles.item}
              onPress={() => handleListPress(list.id)}
            >
              <Ionicons name="list" size={24} color={Colors.primary} />
              <Text style={styles.itemText} numberOfLines={1}>
                {list.name}
              </Text>
              <Text style={styles.itemMeta}>
                {new Date(list.dateCreated).toLocaleDateString()}
              </Text>
            </Pressable>
          ))}
          {recentLists.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent lists</Text>
            </View>
          )}
        </View>
      </View>

      {/* Favorite Malls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Malls</Text>
        <View style={styles.itemsContainer}>
          {favoriteMalls.map((mall) => (
            <Pressable
              key={mall.id}
              style={styles.item}
              onPress={() => handleMallPress(mall.id)}
            >
              <Ionicons name="storefront" size={24} color={Colors.primary} />
              <Text style={styles.itemText} numberOfLines={1}>
                {mall.name}
              </Text>
              <Text style={styles.itemMeta}>
                {mall.location || 'No location set'}
              </Text>
            </Pressable>
          ))}
          {favoriteMalls.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No favorite malls</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.itemsContainer}>
          <Pressable
            style={styles.actionItem}
            onPress={() => router.push('/list/newList')}
          >
            <Ionicons name="add-circle" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>New List</Text>
          </Pressable>
          <Pressable
            style={styles.actionItem}
            onPress={() => router.push('/compare')}
          >
            <Ionicons name="git-compare" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Compare Prices</Text>
          </Pressable>
          <Pressable
            style={styles.actionItem}
            onPress={() => router.push('/list/history')}
          >
            <Ionicons name="time" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>View History</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  section: {
    minWidth: 280,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  item: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  itemMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  emptyState: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  actionItem: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
});
