import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  Text,
} from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useList } from '../context/list/ListContext';
import { useMall } from '../context/mall/MallContext';
import debounce from 'lodash/debounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const { state: listState } = useList();
  const { state: mallState } = useMall();

  const performSearch = useCallback(
    debounce((searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const searchTerm = searchQuery.toLowerCase();
      const searchResults = [];

      // Search in lists
      listState.lists.forEach((list) => {
        if (list.name.toLowerCase().includes(searchTerm)) {
          searchResults.push({
            id: `list-${list.id}`,
            type: 'list',
            title: list.name,
            subtitle: `${list.items?.length || 0} items`,
            route: `/list/${list.id}`,
          });
        }

        // Search in list items
        list.items?.forEach((item) => {
          if (item.name.toLowerCase().includes(searchTerm)) {
            searchResults.push({
              id: `item-${list.id}-${item.id}`,
              type: 'item',
              title: item.name,
              subtitle: `In list: ${list.name}`,
              route: `/list/${list.id}`,
            });
          }
        });
      });

      // Search in malls
      mallState.malls.forEach((mall) => {
        if (
          mall.name.toLowerCase().includes(searchTerm) ||
          mall.location?.toLowerCase().includes(searchTerm)
        ) {
          searchResults.push({
            id: `mall-${mall.id}`,
            type: 'mall',
            title: mall.name,
            subtitle: mall.location || 'No location set',
            route: `/mall/${mall.id}`,
          });
        }
      });

      setResults(searchResults);
    }, 300),
    [listState.lists, mallState.malls]
  );

  const handleQueryChange = (text) => {
    setQuery(text);
    performSearch(text);
  };

  const handleResultPress = (result) => {
    setShowResults(false);
    setQuery('');
    router.push(result.route);
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'list':
        return <Ionicons name="list" size={24} color={Colors.primary} />;
      case 'item':
        return <Ionicons name="cart" size={24} color={Colors.primary} />;
      case 'mall':
        return <Ionicons name="storefront" size={24} color={Colors.primary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.searchBar} onPress={() => setShowResults(true)}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <Text style={styles.placeholder}>Search lists, items, or malls</Text>
      </Pressable>

      <Modal
        visible={showResults}
        animationType="slide"
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={handleQueryChange}
                placeholder="Search lists, items, or malls"
                autoFocus
              />
              {query.length > 0 && (
                <Pressable onPress={() => handleQueryChange('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.text.secondary}
                  />
                </Pressable>
              )}
            </View>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setShowResults(false);
                setQuery('');
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.resultItem}
                onPress={() => handleResultPress(item)}
              >
                {renderIcon(item.type)}
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              query.length > 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No results found</Text>
                </View>
              ) : null
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
  },
  placeholder: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.surface,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    color: Colors.primary,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
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
