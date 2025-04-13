import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from '../hooks/useColorScheme';
import { useList } from '../context/list/ListContext';
import { deleteList } from '../context/actions';
import { useState, useCallback, memo, useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Memoized ListItem component for better performance
const ListItem = memo(({ list, onDelete }) => {
  const { colors } = useColorScheme();
  const itemCount = list.items?.length || 0;
  const previewItems = list.items?.slice(0, 3) || [];
  const remainingItems = itemCount - 3;

  const handlePress = useCallback(() => {
    router.push(`/list/${list.id}`);
  }, [list.id]);

  const handleDelete = useCallback(() => {
    onDelete(list.id);
  }, [list.id, onDelete]);

  return (
    <Pressable
      style={[styles.listItem, { backgroundColor: colors.surface }]}
      onPress={handlePress}
    >
      <View style={styles.listContent}>
        <Text style={[styles.listName, { color: colors.text.primary }]}>
          {list.name}
        </Text>
        <Text style={[styles.dateText, { color: colors.text.secondary }]}>
          {new Date(list.dateCreated).toLocaleDateString()}
        </Text>

        <View style={styles.itemsPreview}>
          {previewItems.map((item) => (
            <Text
              key={item.id}
              style={[styles.itemText, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              • {item.quantity} {item.unit} {item.name}
            </Text>
          ))}
          {remainingItems > 0 && (
            <Text
              style={[styles.remainingItems, { color: colors.text.secondary }]}
            >
              +{remainingItems} more items
            </Text>
          )}
        </View>
      </View>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color={colors.error.main} />
      </Pressable>
    </Pressable>
  );
});

export default function List() {
  const { colors } = useColorScheme();
  const { state, dispatch } = useList();
  const [isLoading, setIsLoading] = useState(true);
  const hasLists = state.lists && state.lists.length > 0;

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteList = useCallback(
    (listId) => {
      Alert.alert('Delete List', 'Are you sure you want to delete this list?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteList(listId));
          },
        },
      ]);
    },
    [dispatch]
  );

  const handleCreateList = useCallback(() => {
    router.push('/list/newList');
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return <ListItem list={item} onDelete={handleDeleteList} />;
    },
    [handleDeleteList]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen
          options={{
            title: 'Shopping Lists',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text.primary,
            headerRight: hasLists
              ? () => (
                  <Pressable
                    onPress={handleCreateList}
                    style={styles.addButton}
                  >
                    <Ionicons name="add" size={24} color={colors.primary} />
                  </Pressable>
                )
              : null,
          }}
        />

        {!hasLists ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyStateText, { color: colors.text.secondary }]}
            >
              No shopping lists yet
            </Text>
            <Pressable
              style={[
                styles.createFirstButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleCreateList}
            >
              <Text
                style={[
                  styles.createFirstButtonText,
                  { color: colors.text.inverse },
                ]}
              >
                Create Your First Shopping List
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Pressable
              style={[
                styles.createNewButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleCreateList}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.text.inverse}
              />
              <Text
                style={[
                  styles.createNewButtonText,
                  { color: colors.text.inverse },
                ]}
              >
                Create New List
              </Text>
            </Pressable>

            <FlashList
              data={state.lists}
              renderItem={renderItem}
              estimatedItemSize={200}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text
                  style={[styles.emptyText, { color: colors.text.secondary }]}
                >
                  No lists found
                </Text>
              }
            />
          </View>
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 20,
  },
  createFirstButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  createFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
    padding: 8,
  },
  listItem: {
    width: '48%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    flex: 1,
    paddingRight: 32,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deleteButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 12,
  },
  itemsPreview: {
    flex: 1,
    gap: 4,
  },
  itemText: {
    fontSize: 13,
    paddingLeft: 4,
  },
  remainingItems: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 4,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  createNewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
