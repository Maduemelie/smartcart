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

  // Add item to list
  const handleAddItem = () => {
    if (!validateItem(currentItem)) return;

    if (currentItem.name.trim()) {
      setItems((prev) => [
        ...prev,
        { ...currentItem, id: Date.now().toString() },
      ]);
      setCurrentItem({
        name: '',
        quantity: '',
        unit: 'kg',
      });
      // Clear errors after successful add
      setErrors({
        listName: '',
        itemName: '',
        quantity: '',
      });
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

    // Proceed with saving
    // ... saving logic here
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
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>
                {item.quantity} {item.unit}
              </Text>
            </View>
          ))}

          {/* Add Item Button */}
          <Pressable
            style={[styles.addItemButton, { backgroundColor: colors.primary }]}
            onPress={handleAddItem}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={colors.text.inverse}
            />
            <Text style={styles.addItemText}>Add Another Item</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  itemInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  itemNameContainer: {
    flex: 2,
  },
  quantityContainer: {
    width: 60,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingLeft: 8,
  },
  itemInput: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    color: Colors.text.primary,
  },
  quantityInput: {
    textAlign: 'center',
  },
  priceInput: {
    width: 80,
    backgroundColor: 'transparent',
  },
  currency: {
    color: Colors.text.secondary,
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  unitButtonText: {
    color: Colors.text.primary,
  },
  mallContainer: {
    marginTop: 8,
  },
  mallLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  mallInput: {
    backgroundColor: Colors.surface + '80',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  addItemText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.accent + '20',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  unitOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent + '20',
  },
  unitOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedUnitText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  inputContainer: {
    // Remove the conditional marginBottom
  },
  inputError: {
    borderWidth: 1,
    // Remove direct reference to Colors.error
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    // Remove direct reference to Colors.error
  },
});
