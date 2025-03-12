import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/ListContext';
import { LIST_ACTIONS, updateList } from '../../context/actions'; // Add this import

export default function ListDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useColorScheme();
  const { state, dispatch } = useList();

  // Get list and initialize state from existing data
  const list = state.lists.find((list) => list.id === id);
  const [purchasedItems, setPurchasedItems] = useState(
    list?.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.purchased || false,
      }),
      {}
    ) || {}
  );
  const [itemPrices, setItemPrices] = useState(
    list?.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.price || '',
      }),
      {}
    ) || {}
  );
  const [storeName, setStoreName] = useState(list?.storeName || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);

  // Add handlers
  const handleTogglePurchased = (itemId) => {
    setPurchasedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    setHasChanges(true);
  };

  const handlePriceChange = (itemId, price) => {
    setItemPrices((prev) => ({
      ...prev,
      [itemId]: price,
    }));
    setHasChanges(true);
  };

  const handleStoreNameChange = (value) => {
    setStoreName(value);
    setHasChanges(true);
  };

  // Add new handlers for editing
  const handleEditItem = (item) => {
    setHasChanges(true);
  };

  // Modified update handler
  const handleUpdateItem = (itemId, field, value) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );

    dispatch({
      type: LIST_ACTIONS.UPDATE_LIST,
      payload: {
        listId: list.id,
        updatedList: { ...list, items: updatedItems },
      },
    });
    setHasChanges(true);
  };

  // Modified save handler
  const handleSaveChanges = () => {
    const updatedItems = list.items.map((item) => ({
      ...item,
      purchased: purchasedItems[item.id] || false,
      price: itemPrices[item.id] || '0',
    }));

    dispatch({
      type: LIST_ACTIONS.UPDATE_LIST,
      payload: {
        listId: list.id,
        updatedList: {
          ...list,
          items: updatedItems,
          storeName: storeName, // Save single store name
        },
      },
    });

    // Show success feedback
    Alert.alert('Success', 'Changes saved successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  // Calculate total
  const totalPrice = Object.values(itemPrices).reduce(
    (sum, price) => sum + (Number(price) || 0),
    0
  );

  if (!list) {
    return (
      <View style={styles.notFound}>
        <Text>List not found</Text>
      </View>
    );
  }

  const StoreSection = () => (
    <Pressable
      style={[styles.storeSection, { backgroundColor: colors.surface }]}
      onPress={() => setIsEditingStore(true)}
    >
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Store Details
      </Text>

      {isEditingStore ? (
        <TextInput
          style={[
            styles.storeInput,
            {
              backgroundColor: colors.surface,
              color: colors.text.primary,
              borderColor: colors.text.secondary,
            },
          ]}
          value={storeName}
          onChangeText={handleStoreNameChange}
          placeholder="Enter store name"
          placeholderTextColor={colors.text.secondary}
          autoFocus
          onBlur={() => setIsEditingStore(false)}
        />
      ) : (
        <View style={styles.storeDisplay}>
          <Ionicons
            name="storefront-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={[styles.storeText, { color: colors.text.primary }]}>
            {storeName || 'Tap to add store name'}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: list.name,
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerShown: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        {/* List Meta Info */}
        <View style={[styles.metaSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dateText, { color: colors.text.secondary }]}>
            Created on {new Date(list.dateCreated).toLocaleDateString()}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.itemCount, { color: colors.text.primary }]}>
              {list.items.length} items
            </Text>
            <Text style={[styles.totalPrice, { color: colors.text.primary }]}>
              Total: ₦{totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.itemsSection}>
          {list.items.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.itemRow, { backgroundColor: colors.surface }]}
              onPress={() => handleEditItem(item)}
            >
              <Pressable
                style={styles.checkbox}
                onPress={() => handleTogglePurchased(item.id)}
              >
                <Ionicons
                  name={purchasedItems[item.id] ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={
                    purchasedItems[item.id]
                      ? colors.primary
                      : colors.text.secondary
                  }
                />
              </Pressable>

              <View style={styles.itemInfo}>
                <TextInput
                  style={[styles.itemNameInput, { color: colors.text.primary }]}
                  value={item.name}
                  onChangeText={(value) =>
                    handleUpdateItem(item.id, 'name', value)
                  }
                  placeholder="Item name"
                  onFocus={() => setHasChanges(true)}
                />
                <View style={styles.itemMetaInputs}>
                  <TextInput
                    style={[
                      styles.quantityInput,
                      { color: colors.text.primary },
                    ]}
                    value={item.quantity}
                    onChangeText={(value) =>
                      handleUpdateItem(item.id, 'quantity', value)
                    }
                    keyboardType="numeric"
                    onFocus={() => setHasChanges(true)}
                  />
                  <TextInput
                    style={[styles.unitInput, { color: colors.text.primary }]}
                    value={item.unit}
                    onChangeText={(value) =>
                      handleUpdateItem(item.id, 'unit', value)
                    }
                    onFocus={() => setHasChanges(true)}
                  />
                </View>
              </View>

              {/* Price input stays the same */}
              {purchasedItems[item.id] && (
                <View style={styles.priceInputContainer}>
                  <Text
                    style={[styles.currency, { color: colors.text.secondary }]}
                  >
                    ₦
                  </Text>
                  <TextInput
                    style={[
                      styles.priceInput,
                      {
                        color: colors.text.primary,
                        backgroundColor: colors.surface,
                      },
                    ]}
                    value={itemPrices[item.id] || ''}
                    onChangeText={(value) => handlePriceChange(item.id, value)}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Store Input Section */}
        <StoreSection />
      </ScrollView>

      {/* Conditional Footer */}
      {hasChanges && (
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveChanges}
          >
            <Text
              style={[styles.saveButtonText, { color: colors.text.inverse }]}
            >
              Save Changes
            </Text>
          </Pressable>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  metaSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsSection: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 14,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    padding: 8,
    marginRight: 8,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  currency: {
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    padding: 8,
    borderRadius: 4,
    width: 80,
    textAlign: 'right',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    flex: 1,
    gap: 8,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editInput: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  quantityInput: {
    width: 60,
  },
  unitInput: {
    width: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  storeInput: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 14,
    width: '100%',
  },
  storeSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  editListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemNameInput: {
    fontSize: 16,
    fontWeight: '500',
    padding: 4,
    marginBottom: 4,
  },
  itemMetaInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  storeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  storeText: {
    fontSize: 16,
    flex: 1,
  },
});
