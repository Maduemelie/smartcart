import { useState, useMemo } from 'react';
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
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
  const { createList, state: listState, addCustomUnit } = useList();
  const { state: mallState } = useMall();
  const [step, setStep] = useState(1);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemInput, setNewItemInput] = useState('');
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newUnitInput, setNewUnitInput] = useState('');
  const [tempQuantity, setTempQuantity] = useState('');
  const [tempUnit, setTempUnit] = useState('');

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

  const handleNewItemSubmit = () => {
    if (!newItemInput.trim()) return;

    const itemLines = newItemInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    itemLines.forEach((line) => {
      const trimmed = line.trim();
      if (/^\d/.test(trimmed)) {
        // Only use regex when the line starts with a digit
        const match = trimmed.match(/^(\d+(?:\.\d+)?)\s+([^\s]+)\s+(.+)$/);
        if (match) {
          const [, quantity, unit, name] = match;
          handleQuickAdd(name.replace(/\s+/g, ' ').trim(), quantity, unit);
        } else {
          // Fallback for invalid format but starts with number
          handleQuickAdd(trimmed, '1', 'pcs');
        }
      } else {
        // No quantity → the whole line is the name
        handleQuickAdd(trimmed, '1', 'pcs');
      }
    });

    setNewItemInput('');
    setSearchQuery('');
  };
  const handleQuickAdd = (itemName, quantity = '1', unit = 'pcs') => {
    if (items.some((item) => item.name === itemName)) return;

    // Ensure quantity is a valid number
    const numberQuantity = parseFloat(quantity) || 1;

    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        name: itemName.replace(/\s+/g, ' ').trim(),
        quantity: numberQuantity.toString(),
        unit: unit.trim(),
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
      mallId: selectedStore?.id,
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

  const handleUpdateItemMeta = (itemId, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const handleAddCustomUnit = () => {
    if (!newUnitInput.trim()) return;
    addCustomUnit(newUnitInput.trim());
    setTempUnit(newUnitInput.trim());
    setNewUnitInput('');
  };

  const openUnitSelector = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    setSelectedItemId(itemId);
    setTempQuantity(item.quantity);
    setTempUnit(item.unit);
    setShowUnitModal(true);
  };

  const saveItemMeta = () => {
    if (selectedItemId) {
      handleUpdateItemMeta(selectedItemId, {
        quantity: tempQuantity || '1',
        unit: tempUnit || 'pcs',
      });
    }
    setShowUnitModal(false);
    setSelectedItemId(null);
    setTempQuantity('');
    setTempUnit('');
  };

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

            {/* New Item Input with Auto-complete */}
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.text.secondary}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                value={newItemInput}
                onChangeText={(text) => {
                  setNewItemInput(text);
                  setSearchQuery(text);
                }}
                placeholder="Add items (one per line)..."
                placeholderTextColor={colors.text.secondary}
                returnKeyType="done"
                onSubmitEditing={handleNewItemSubmit}
                multiline={true}
                textAlignVertical="top"
                numberOfLines={3}
              />
              {newItemInput.trim() && (
                <Pressable onPress={handleNewItemSubmit}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                </Pressable>
              )}
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
                    onPress={() => {
                      handleQuickAdd(item);
                      setNewItemInput('');
                      setSearchQuery('');
                    }}
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
                {/* Categories */}
                {Object.entries(QUICK_ADD_CATEGORIES).map(
                  ([category, categoryItems]) => (
                    <View key={`category-${category}`} style={styles.section}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        {category}
                      </Text>
                      <View style={styles.quickAddGrid}>
                        {categoryItems.map((item) => (
                          <Pressable
                            key={`${category}-${item}`}
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

            {/* Frequently Bought Items */}
            {frequentItems.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                >
                  Frequently Bought
                </Text>
                <View style={styles.quickAddGrid}>
                  {frequentItems.map((item, index) => (
                    <Pressable
                      key={`frequent-${item}-${index}`}
                      style={[
                        styles.quickAddItem,
                        { backgroundColor: colors.surface },
                      ]}
                      onPress={() => handleQuickAdd(item)}
                    >
                      <Text style={{ color: colors.text.primary }}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
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
                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemText,
                          { color: colors.text.primary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Pressable
                        onPress={() => openUnitSelector(item.id)}
                        style={styles.quantityUnit}
                      >
                        <Text
                          style={[
                            styles.quantityUnitText,
                            { color: colors.text.secondary },
                          ]}
                        >
                          {parseFloat(item.quantity || 0)
                            .toFixed(2)
                            .replace(/\.?0+$/, '')}{' '}
                          {item.unit}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color={colors.text.secondary}
                        />
                      </Pressable>
                    </View>
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
          // Step 2: Store Selection and Finalization
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Choose a Store (Optional)
            </Text>

            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Selecting a store helps track prices and find the best deals
            </Text>

            <View style={styles.mallList}>
              {mallState.malls.map((store) => (
                <Pressable
                  key={store.id}
                  style={[
                    styles.mallItem,
                    { backgroundColor: colors.surface },
                    selectedStore?.id === store.id && styles.selectedMall,
                  ]}
                  onPress={() => setSelectedStore(store)}
                >
                  <View style={styles.mallInfo}>
                    <Text
                      style={[styles.mallName, { color: colors.text.primary }]}
                    >
                      {store.name}
                    </Text>
                    {store.location && (
                      <Text
                        style={[
                          styles.mallLocation,
                          { color: colors.text.secondary },
                        ]}
                      >
                        {store.location}
                      </Text>
                    )}
                  </View>
                  {selectedStore?.id === store.id && (
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

      {/* Unit Selection Modal */}
      {showUnitModal && (
        <View
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Set Quantity & Unit
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.quantityInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  },
                ]}
                value={tempQuantity}
                onChangeText={setTempQuantity}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
              />

              <View style={styles.unitsGrid}>
                {listState.customUnits.map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.unitOption,
                      { backgroundColor: colors.surface },
                      tempUnit === unit && styles.selectedUnit,
                    ]}
                    onPress={() => setTempUnit(unit)}
                  >
                    <Text
                      style={{
                        color:
                          tempUnit === unit
                            ? colors.primary
                            : colors.text.primary,
                      }}
                    >
                      {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.addUnitContainer}>
                <TextInput
                  style={[
                    styles.unitInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text.primary,
                    },
                  ]}
                  value={newUnitInput}
                  onChangeText={setNewUnitInput}
                  placeholder="Add custom unit"
                  placeholderTextColor={colors.text.secondary}
                />
                <Pressable
                  onPress={handleAddCustomUnit}
                  style={[
                    styles.addUnitButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={{ color: colors.text.inverse }}>Add</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => setShowUnitModal(false)}
              >
                <Text style={{ color: colors.text.primary }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={saveItemMeta}
              >
                <Text style={{ color: colors.text.inverse }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
    padding: 8,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  itemNameInput: {
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
    marginBottom: 4,
    minHeight: 40,
  },
  quantityInput: {
    width: 60,
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  unitInput: {
    width: 80,
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    textAlign: 'center',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  unitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  unitOption: {
    padding: 8,
    borderRadius: 8,
  },
  selectedUnit: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  addUnitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addUnitButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
});
