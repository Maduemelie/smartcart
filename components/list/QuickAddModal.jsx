import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export const QuickAddModal = ({ visible, onClose, onAdd, colors }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');

  const handleAdd = () => {
    if (!itemName.trim()) return;

    onAdd({
      name: itemName.trim(),
      quantity: parseFloat(quantity) || 1,
      unit: unit.trim(),
    });

    setItemName('');
    setQuantity('1');
    setUnit('pcs');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            Add Item
          </Text>

          <TextInput
            style={[
              styles.modalInput,
              { backgroundColor: colors.surface, color: colors.text.primary },
            ]}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Item name"
            placeholderTextColor={colors.text.secondary}
            autoFocus
          />

          <View style={styles.modalRow}>
            <TextInput
              style={[
                styles.modalInputSmall,
                { backgroundColor: colors.surface, color: colors.text.primary },
              ]}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
              keyboardType="numeric"
              placeholderTextColor={colors.text.secondary}
            />
            <TextInput
              style={[
                styles.modalInputSmall,
                { backgroundColor: colors.surface, color: colors.text.primary },
              ]}
              value={unit}
              onChangeText={setUnit}
              placeholder="pcs"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              onPress={onClose}
            >
              <Text
                style={[styles.modalButtonText, { color: colors.text.primary }]}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleAdd}
            >
              <Text
                style={[styles.modalButtonText, { color: colors.text.inverse }]}
              >
                Add
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
  modalInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modalInputSmall: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 44,
    textAlignVertical: 'center',
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
