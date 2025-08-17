import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

export const EditItemModal = ({ visible, onClose, item, onSave, colors }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  // Update state when item changes
  useEffect(() => {
    if (item) {
      setItemName(item.name || '');
      setQuantity(item.quantity?.toString() || '');
      setUnit(item.unit || '');
      console.log('EditItemModal - Loading item:', {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      });
    }
  }, [item]);

  const handleSave = () => {
    const trimmedItemName = itemName.trim();
    if (!trimmedItemName) {
      Alert.alert('Invalid Input', 'Item name cannot be empty.');
      return;
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid quantity greater than zero.'
      );
      return;
    }

    onSave(item.id, {
      name: trimmedItemName,
      quantity: parsedQuantity,
      unit: unit.trim() || 'pcs',
    });
    onClose();
  };

  const handleClose = () => {
    // Reset to original values
    if (item) {
      setItemName(item.name || '');
      setQuantity(item.quantity?.toString() || '');
      setUnit(item.unit || '');
    }
    onClose();
  };

  if (!item) return null;

  // Safe color fallbacks
  const safeColors = {
    textPrimary: colors.text?.primary || '#000000',
    textSecondary: colors.text?.secondary || '#666666',
    surface: colors.surface || '#FFFFFF',
    background: colors.background || '#F5F5F5',
    border: colors.border || '#E0E0E0',
    primary: colors.primary || '#007AFF',
    textInverse: colors.text?.inverse || '#FFFFFF',
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: safeColors.background },
          ]}
        >
          <Text style={[styles.modalTitle, { color: safeColors.textPrimary }]}>
            Edit Item
          </Text>

          <View style={styles.editForm}>
            <Text
              style={[styles.fieldLabel, { color: safeColors.textSecondary }]}
            >
              Item Name
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: safeColors.surface,
                  color: safeColors.textPrimary,
                  borderColor: safeColors.border,
                  borderWidth: 1,
                },
              ]}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Item name"
              placeholderTextColor={safeColors.textSecondary}
              autoFocus
              selectionColor={safeColors.primary}
            />

            <Text
              style={[styles.fieldLabel, { color: safeColors.textSecondary }]}
            >
              Quantity & Unit
            </Text>
            <View style={styles.modalRow}>
              <View style={styles.quantityContainer}>
                <Text
                  style={[styles.inputLabel, { color: safeColors.textPrimary }]}
                >
                  Quantity
                </Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    {
                      backgroundColor: safeColors.surface,
                      color: safeColors.textPrimary,
                      borderColor: safeColors.border,
                      borderWidth: 1,
                      fontSize: 16,
                      fontWeight: '500',
                    },
                  ]}
                  value={quantity}
                  onChangeText={(text) => {
                    console.log('Quantity changing from', quantity, 'to', text);
                    setQuantity(text);
                  }}
                  placeholder="1"
                  keyboardType="numeric"
                  placeholderTextColor={safeColors.textSecondary}
                  selectionColor={safeColors.primary}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.unitContainer}>
                <Text
                  style={[styles.inputLabel, { color: safeColors.textPrimary }]}
                >
                  Unit
                </Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    {
                      backgroundColor: safeColors.surface,
                      color: safeColors.textPrimary,
                      borderColor: safeColors.border,
                      borderWidth: 1,
                      fontSize: 16,
                      fontWeight: '500',
                    },
                  ]}
                  value={unit}
                  onChangeText={(text) => {
                    console.log('Unit changing from', unit, 'to', text);
                    setUnit(text);
                  }}
                  placeholder="pcs"
                  placeholderTextColor={safeColors.textSecondary}
                  selectionColor={safeColors.primary}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Quick unit options */}
            <Text
              style={[styles.fieldLabel, { color: safeColors.textSecondary }]}
            >
              Quick Units
            </Text>
            <View style={styles.quickUnits}>
              {['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'box'].map((quickUnit) => (
                <Pressable
                  key={quickUnit}
                  style={[
                    styles.quickUnitButton,
                    {
                      backgroundColor: safeColors.surface,
                      borderColor: safeColors.border,
                      borderWidth: 1,
                    },
                    unit === quickUnit && {
                      backgroundColor: safeColors.primary,
                    },
                  ]}
                  onPress={() => setUnit(quickUnit)}
                >
                  <Text
                    style={[
                      styles.quickUnitText,
                      {
                        color:
                          unit === quickUnit
                            ? safeColors.textInverse
                            : safeColors.textPrimary,
                      },
                    ]}
                  >
                    {quickUnit}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Pressable
              style={[
                styles.modalButton,
                {
                  backgroundColor: safeColors.surface,
                  borderWidth: 1,
                  borderColor: safeColors.border,
                },
              ]}
              onPress={handleClose}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: safeColors.textPrimary },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                { backgroundColor: safeColors.primary },
              ]}
              onPress={handleSave}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: safeColors.textInverse },
                ]}
              >
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  editForm: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  modalInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  unitContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  modalInputSmall: {
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  quickUnits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickUnitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickUnitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
