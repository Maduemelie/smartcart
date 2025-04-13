import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/list/ListContext';
import { deleteList } from '../../context/actions';
import { useState } from 'react';

function ListItem({ list, onDelete }) {
  const { colors } = useColorScheme();
  const itemCount = list.items?.length || 0;
  // Show only first 3 items
  const previewItems = list.items?.slice(0, 3) || [];
  const remainingItems = itemCount - 3;

  return (
    <Pressable
      style={[styles.listItem, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/list/${list.id}`)}
    >
      <View style={styles.listContent}>
        <Text style={[styles.listName, { color: colors.text.primary }]}>
          {list.name}
        </Text>
        <Text style={[styles.dateText, { color: colors.text.secondary }]}>
          {new Date(list.dateCreated).toLocaleDateString()}
        </Text>

        {/* Preview Items */}
        <View style={styles.itemsPreview}>
          {previewItems.map((item, index) => (
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

      <Pressable style={styles.deleteButton} onPress={() => onDelete(list.id)}>
        <Ionicons name="trash-outline" size={20} color={colors.error.main} />
      </Pressable>
    </Pressable>
  );
}

export default function List() {
  const { colors } = useColorScheme();
  const { state, dispatch } = useList();
  const hasLists = state.lists && state.lists.length > 0;
  const [numColumns] = useState(2); // Add state for columns

  const handleDeleteList = (listId) => {
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
  };

  const handleCreateList = () => {
    router.push('/list/newList');
  };

  return (
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
                <Pressable onPress={handleCreateList} style={styles.addButton}>
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

          <FlatList
            key={`grid-${numColumns}`}
            style={[
              styles.listContainer,
              { backgroundColor: colors.background },
            ]}
            data={state.lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem list={item} onDelete={handleDeleteList} />
            )}
            numColumns={numColumns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
          />
        </View>
      )}
    </SafeAreaView>
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
    padding: 8, // Reduced padding to accommodate grid
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  listItem: {
    width: '48%', // Changed from flex to fixed width percentage
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    minHeight: 180, // Increased height for content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    flex: 1,
    paddingRight: 32, // Add space for delete button
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  listMeta: {
    fontSize: 12, // Reduced font size for grid layout
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  deleteButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
  },
  gridContent: {
    padding: 8,
    paddingBottom: 16,
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
