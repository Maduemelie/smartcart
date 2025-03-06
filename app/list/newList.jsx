import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/ListContext';
import { createList } from '../../context/actions';
import { router } from 'expo-router';
import { createStyles } from '../../styles/newList.styles';

const UNITS = [
  'kg',
  'g',
  'L',
  'ml',
  'pcs',
  'pack',
  'carton',
  'dozen',
  'bag',
  'bottle',
  'tin',
  'sachet',
  'bunch',
  'tuber',
  'basket',
];

export default function NewList() {
  const { colors } = useColorScheme();
  const styles = createStyles(colors);
  const { dispatch } = useList();
  // List level state
  const [listName, setListName] = useState('');

  // Current item states
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
  });

  // Array to store all items
  const [items, setItems] = useState([]);

  // Existing unit picker states
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const [errors, setErrors] = useState({
    listName: '',
    itemName: '',
    quantity: '',
  });

  const [editingItem, setEditingItem] = useState(null);

  const validateListName = (name) => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, listName: 'List name is required' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, listName: '' }));
    return true;
  };

  const validateItem = (item) => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate item name
    if (!item.name.trim()) {
      newErrors.itemName = 'Item name is required';
      isValid = false;
    }

    // Validate quantity
    if (!item.quantity) {
      newErrors.quantity = 'Quantity is required';
      isValid = false;
    } else if (isNaN(item.quantity) || Number(item.quantity) <= 0) {
      newErrors.quantity = 'Invalid quantity';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update input handlers
  const handleItemChange = (field, value) => {
    setCurrentItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setCurrentItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      id: item.id,
    });
  };

  const handleUpdateItem = () => {
    if (!validateItem(currentItem)) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === currentItem.id ? { ...currentItem } : item
      )
    );

    setCurrentItem({
      name: '',
      quantity: '',
      unit: 'kg',
    });
    setEditingItem(null);
    setErrors({
      listName: '',
      itemName: '',
      quantity: '',
    });
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert('Delete Item', 'Are you sure you want to remove this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setItems((prev) => prev.filter((item) => item.id !== itemId));
        },
        style: 'destructive',
      },
    ]);
  };

  // Add item to list
  const handleAddItem = () => {
    if (!validateItem(currentItem)) return;

    if (currentItem.name.trim()) {
      if (editingItem) {
        handleUpdateItem();
      } else {
        setItems((prev) => [
          ...prev,
          { ...currentItem, id: Date.now().toString() },
        ]);
        setCurrentItem({
          name: '',
          quantity: '',
          unit: 'kg',
        });
        setErrors({
          listName: '',
          itemName: '',
          quantity: '',
        });
      }
    }
  };

  const handleSaveList = () => {
    // Validate list name
    if (!validateListName(listName)) return;

    // Validate items array
    if (items.length === 0) {
      Alert.alert('Error', 'Add at least one item to the list');
      return;
    }

    // Create new list object
    const newList = {
      name: listName.trim(),
      items: items,
      completed: false,
      dateCreated: new Date().toISOString(),
    };

    try {
      // Dispatch the create list action
      dispatch(createList(newList));

      // Show success message
      Alert.alert('Success', 'Shopping list created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to lists page
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create shopping list');
      console.error('Error creating list:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Create New List',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
        }}
      />

      <ScrollView style={styles.content}>
        {/* List Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>List Name</Text>
          {/* List Name Input with Error */}
          <View
            style={{
              marginBottom: errors.listName ? 24 : 16, // Moved from StyleSheet
            }}
          >
            <TextInput
              style={[
                styles.titleInput,
                { backgroundColor: colors.surface, color: colors.text.primary },
                errors.listName && { borderColor: colors.error.main },
              ]}
              value={listName}
              onChangeText={(text) => {
                setListName(text);
                if (errors.listName) validateListName(text);
              }}
              placeholder="Enter list name..."
              placeholderTextColor={colors.text.secondary}
            />
            {errors.listName ? (
              <Text
                style={{ color: colors.error.main, fontSize: 12, marginTop: 4 }}
              >
                {errors.listName}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>

          {/* Single Item Input Row */}
          <View style={styles.itemInputRow}>
            <View style={styles.itemNameContainer}>
              <TextInput
                style={[
                  styles.itemInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  },
                ]}
                value={currentItem.name}
                onChangeText={(value) => handleItemChange('name', value)}
                placeholder="Item name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.quantityContainer}>
              <TextInput
                style={[
                  styles.itemInput,
                  styles.quantityInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  },
                ]}
                value={currentItem.quantity}
                onChangeText={(value) => handleItemChange('quantity', value)}
                placeholder="Qty"
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <Pressable
              style={[styles.unitButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowUnitPicker(true)}
            >
              <Text style={styles.unitButtonText}>{currentItem.unit}</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>

          {/* Display added items */}
          {items.map((item) => (
            <View
              key={item.id}
              style={[styles.itemRow, { backgroundColor: colors.surface }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemText, { color: colors.text.primary }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.itemText, { color: colors.text.secondary }]}
                >
                  {item.quantity} {item.unit}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <Pressable
                  onPress={() => handleEditItem(item)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </Pressable>
                <Pressable
                  onPress={() => handleDeleteItem(item.id)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="trash" size={18} color={colors.error.main} />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Add Item Button */}
          <Pressable
            style={[styles.addItemButton, { backgroundColor: colors.primary }]}
            onPress={handleAddItem}
          >
            <Ionicons
              name={
                editingItem ? 'checkmark-circle-outline' : 'add-circle-outline'
              }
              size={20}
              color={colors.text.inverse}
            />
            <Text style={styles.addItemText}>
              {editingItem ? 'Update Item' : 'Add Another Item'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveList}
        >
          <Text style={styles.saveButtonText}>Save List</Text>
        </Pressable>
      </View>

      {/* Add Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={styles.modalTitle}>Select Unit</Text>
            <ScrollView>
              {UNITS.map((unit) => (
                <Pressable
                  key={unit}
                  style={styles.unitOption}
                  onPress={() => {
                    setCurrentItem((prev) => ({
                      ...prev,
                      unit: unit,
                    }));
                    setShowUnitPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.unitOptionText,
                      unit === currentItem.unit && styles.selectedUnitText,
                    ]}
                  >
                    {unit}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowUnitPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
