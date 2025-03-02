import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useList } from '../context/ListContext';

export default function List() {
  const { state } = useList();
  const hasLists = state.lists && state.lists.length > 0;

  const handleCreateList = () => {
    router.push('/list/newList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shopping Lists',
          headerRight: hasLists
            ? () => (
                <Pressable onPress={handleCreateList} style={styles.addButton}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </Pressable>
              )
            : null,
        }}
      />

      {!hasLists ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No shopping lists yet</Text>
          <Pressable
            style={styles.createFirstButton}
            onPress={handleCreateList}
          >
            <Text style={styles.createFirstButtonText}>
              Create Your First Shopping List
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {/* Lists will be rendered here later */}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  createFirstButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
});
