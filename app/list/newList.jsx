import { useState } from 'react';
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
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/list/ListContext';

const generateId = () =>
  `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function NewList() {
  const { colors } = useColorScheme();

  const { createList } = useList();
  const [listName, setListName] = useState('');

  const [itemsInput, setItemsInput] = useState('');
  const [parsedItems, setParsedItems] = useState([]);

  // Parse items as user types
  const parseItems = (text) => {
    if (!text.trim()) {
      setParsedItems([]);
      return;
    }

    const lines = text
      .split(/[,\n]/) // Split by comma or newline
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const items = lines.map((line) => {
      // Try to parse quantity and unit from the beginning
      const match = line.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s*(.+)$/);

      if (match) {
        const [, quantity, unit, name] = match;
        return {
          id: generateId(),
          name: name.trim(),
          quantity: parseFloat(quantity),
          unit: unit || 'pcs',
        };
      } else {
        // No quantity found, use empty defaults that user can fill
        return {
          id: generateId(),
          name: line.trim(),

          quantity: '', // Changed from 1 to empty string
          unit: '', // Changed from 'pcs' to empty string
        };
      }
    });

    setParsedItems(items);
  };

  const handleItemsInputChange = (text) => {
    setItemsInput(text);
    parseItems(text);
  };

  const handleEditItem = (itemId, field, value) => {
    setParsedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,

              [field]:
                field === 'quantity'
                  ? value === ''
                    ? ''
                    : parseFloat(value) || ''
                  : value,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== itemId));

    // Also remove from input text (simple approach)
    const remainingItems = parsedItems
      .filter((item) => item.id !== itemId)
      .map((item) => {
        // Handle empty or default values
        const quantity =
          item.quantity === '' || item.quantity === 1 ? '' : item.quantity;
        const unit = item.unit === '' || item.unit === 'pcs' ? '' : item.unit;

        if (!quantity && !unit) {
          return item.name;
        }

        return `${quantity}${unit ? ' ' + unit : ''} ${item.name}`.trim();
      });

    setItemsInput(remainingItems.join(', '));
  };

  const handleCreateList = () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    if (parsedItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    // Validate and clean up items before creating list
    const cleanedItems = parsedItems.map((item) => ({
      ...item,
      quantity: item.quantity === '' ? 1 : parseFloat(item.quantity) || 1,
      unit: item.unit === '' ? 'pcs' : item.unit,
    }));

    const newList = {
      id: `list-${Date.now()}`,
      name: listName.trim(),

      items: cleanedItems,
      purchasedItems: [],
    };

    createList(newList);
    Alert.alert('Success', 'Shopping list created!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'New List',
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* List Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            List Name
          </Text>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              },
            ]}
            value={listName}
            onChangeText={setListName}
            placeholder="My Shopping List"
            placeholderTextColor={colors.text.secondary}
            returnKeyType="next"
          />
        </View>

        {/* Items Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Add Items
          </Text>
          <Text style={[styles.hint, { color: colors.text.secondary }]}>
            Type items separated by commas or new lines. Example: "2kg rice,
            milk, bread"
          </Text>
          <TextInput
            style={[
              styles.itemsInput,
              {
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              },
            ]}
            value={itemsInput}
            onChangeText={handleItemsInputChange}
            placeholder="2kg rice, milk, bread, 3 eggs..."
            placeholderTextColor={colors.text.secondary}
            multiline
            textAlignVertical="top"
            returnKeyType="default"
          />
        </View>

        {/* Parsed Items Preview */}
        {parsedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Items ({parsedItems.length})
            </Text>

            {parsedItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.itemInfo}>
                  <Text
                    style={[styles.itemName, { color: colors.text.primary }]}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.itemMeta}>
                    <TextInput
                      style={[
                        styles.quantityInput,
                        {
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border,
                        },
                      ]}
                      value={item.quantity.toString()}
                      onChangeText={(value) =>
                        handleEditItem(item.id, 'quantity', value)
                      }
                      placeholder="1"
                      placeholderTextColor={colors.text.secondary}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={[
                        styles.unitInput,
                        {
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border,
                        },
                      ]}
                      value={item.unit}
                      onChangeText={(value) =>
                        handleEditItem(item.id, 'unit', value)
                      }
                      placeholder="pcs"
                      placeholderTextColor={colors.text.secondary}
                    />
                  </View>
                </View>

                <Pressable
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.error}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      {listName.trim() && parsedItems.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Pressable
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateList}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.text.inverse}
            />
            <Text
              style={[styles.createButtonText, { color: colors.text.inverse }]}
            >
              Create List
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

  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  nameInput: {
    fontSize: 18,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },

  itemsInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 120,
  },

  itemRow: {
    flexDirection: 'row',

    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityInput: {
    width: 60,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  unitInput: {
    width: 80,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    textAlign: 'center',
  },

  removeButton: {
    padding: 4,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },

  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
