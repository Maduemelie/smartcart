import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/list/ListContext';
import { useMall } from '../../context/mall/MallContext';

// Common categories and items
const QUICK_ADD_CATEGORIES = {
  'Fruits & Vegetables': [
    'Tomatoes',
    'Onions',
    'Potatoes',
    'Bananas',
    'Apples',
  ],
  'Dairy & Eggs': ['Milk', 'Eggs', 'Cheese', 'Yogurt'],
  'Meat & Fish': ['Chicken', 'Beef', 'Fish'],
  'Grains & Bread': ['Rice', 'Bread', 'Pasta'],
  Beverages: ['Water', 'Juice', 'Soft Drinks'],
};

export default function NewList() {
  const { colors } = useColorScheme();
  const { createList, state: listState } = useList();
  const { state: mallState } = useMall();
  const [step, setStep] = useState(1);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedMall, setSelectedMall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get frequently bought items from purchase history
  const frequentItems = useMemo(() => {
    const itemCounts = {};
    listState.purchaseHistory.forEach((purchase) => {
      purchase.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
      });
    });
    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);
  }, [listState.purchaseHistory]);

  const handleQuickAdd = (itemName) => {
    if (items.some((item) => item.name === itemName)) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: itemName,
        quantity: '1',
        unit: 'pcs',
        purchased: false,
      },
    ]);
  };

  const handleRemoveItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCreateList = () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Add at least one item to the list');
      return;
    }

    const newList = {
      id: Date.now().toString(),
      name: listName.trim(),
      items,
      mallId: selectedMall?.id,
      dateCreated: new Date().toISOString(),
      status: 'NEW',
    };

    createList(newList);
    Alert.alert('Success', 'Shopping list created!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const results = new Set();

    // Search in categories
    Object.entries(QUICK_ADD_CATEGORIES).forEach(([category, items]) => {
      if (category.toLowerCase().includes(query)) {
        items.forEach((item) => results.add(item));
      } else {
        items.forEach((item) => {
          if (item.toLowerCase().includes(query)) results.add(item);
        });
      }
    });

    // Search in frequent items
    frequentItems.forEach((item) => {
      if (item.toLowerCase().includes(query)) results.add(item);
    });

    return Array.from(results);
  }, [searchQuery, frequentItems]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Create Shopping List',
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content}>
        {step === 1 ? (
          // Step 1: Name and Quick Add
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Create a New Shopping List
            </Text>

            <TextInput
              style={[styles.nameInput, { backgroundColor: colors.surface }]}
              value={listName}
              onChangeText={setListName}
              placeholder="Give your list a name..."
              placeholderTextColor={colors.text.secondary}
            />

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.text.secondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search items..."
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            {searchQuery ? (
              // Search Results
              <View style={styles.searchResults}>
                {filteredItems.map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.searchItem,
                      { backgroundColor: colors.surface },
                    ]}
                    onPress={() => handleQuickAdd(item)}
                  >
                    <Text style={{ color: colors.text.primary }}>{item}</Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <>
                {/* Frequently Bought Items */}
                {frequentItems.length > 0 && (
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.text.primary },
                      ]}
                    >
                      Frequently Bought
                    </Text>
                    <View style={styles.quickAddGrid}>
                      {frequentItems.map((item) => (
                        <Pressable
                          key={item}
                          style={[
                            styles.quickAddItem,
                            { backgroundColor: colors.surface },
                          ]}
                          onPress={() => handleQuickAdd(item)}
                        >
                          <Text style={{ color: colors.text.primary }}>
                            {item}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* Categories */}
                {Object.entries(QUICK_ADD_CATEGORIES).map(
                  ([category, items]) => (
                    <View key={category} style={styles.section}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        {category}
                      </Text>
                      <View style={styles.quickAddGrid}>
                        {items.map((item) => (
                          <Pressable
                            key={item}
                            style={[
                              styles.quickAddItem,
                              { backgroundColor: colors.surface },
                            ]}
                            onPress={() => handleQuickAdd(item)}
                          >
                            <Text style={{ color: colors.text.primary }}>
                              {item}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )
                )}
              </>
            )}

            {/* Selected Items */}
            {items.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                >
                  Selected Items ({items.length})
                </Text>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.selectedItem,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={{ color: colors.text.primary }}>
                      {item.name}
                    </Text>
                    <Pressable onPress={() => handleRemoveItem(item.id)}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={Colors.error.main}
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Next Button */}
            {items.length > 0 && listName && (
              <Pressable
                style={[styles.nextButton, { backgroundColor: colors.primary }]}
                onPress={() => setStep(2)}
              >
                <Text
                  style={[styles.buttonText, { color: colors.text.inverse }]}
                >
                  Continue
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.text.inverse}
                />
              </Pressable>
            )}
          </View>
        ) : (
          // Step 2: Mall Selection and Finalization
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Choose a Mall (Optional)
            </Text>

            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Selecting a mall helps track prices and find the best deals
            </Text>

            <View style={styles.mallList}>
              {mallState.malls.map((mall) => (
                <Pressable
                  key={mall.id}
                  style={[
                    styles.mallItem,
                    { backgroundColor: colors.surface },
                    selectedMall?.id === mall.id && styles.selectedMall,
                  ]}
                  onPress={() => setSelectedMall(mall)}
                >
                  <View style={styles.mallInfo}>
                    <Text
                      style={[styles.mallName, { color: colors.text.primary }]}
                    >
                      {mall.name}
                    </Text>
                    {mall.location && (
                      <Text
                        style={[
                          styles.mallLocation,
                          { color: colors.text.secondary },
                        ]}
                      >
                        {mall.location}
                      </Text>
                    )}
                  </View>
                  {selectedMall?.id === mall.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.backButton, { backgroundColor: colors.surface }]}
                onPress={() => setStep(1)}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.text.primary}
                />
                <Text
                  style={[styles.buttonText, { color: colors.text.primary }]}
                >
                  Back
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.createButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleCreateList}
              >
                <Text
                  style={[styles.buttonText, { color: colors.text.inverse }]}
                >
                  Create List
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  nameInput: {
    fontSize: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAddItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchResults: {
    gap: 8,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  mallList: {
    gap: 8,
  },
  mallItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectedMall: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  mallInfo: {
    flex: 1,
  },
  mallName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  mallLocation: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
