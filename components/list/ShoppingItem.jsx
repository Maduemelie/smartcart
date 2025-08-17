import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ShoppingItem = ({
  item,
  onMarkPurchased,
  onEdit,
  onDelete,
  colors,
}) => {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [price, setPrice] = useState('');

  const handleMarkPurchased = () => {
    if (showPriceInput) {
      onMarkPurchased(item.id, parseFloat(price) || 0);
      setPrice('');
      setShowPriceInput(false);
    } else {
      setShowPriceInput(true);
    }
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <View style={[styles.itemCard, { backgroundColor: colors.surface }]}>
      <View style={styles.itemContent}>
        <Pressable style={styles.itemLeft} onPress={handleMarkPurchased}>
          <View style={[styles.checkbox, { borderColor: colors.border }]}>
            <Ionicons name="checkmark" size={16} color="transparent" />
          </View>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: colors.text.primary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.itemQuantity, { color: colors.text.secondary }]}
            >
              {item.quantity} {item.unit}
            </Text>
          </View>
        </Pressable>

        <View style={styles.itemActions}>
          <Pressable onPress={handleEdit} style={styles.actionButton}>
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.text.secondary}
            />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>

      {showPriceInput && (
        <View style={[styles.priceInput, { borderTopColor: colors.border }]}>
          <TextInput
            style={[
              styles.priceTextInput,
              {
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border,
              },
            ]}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price (optional)"
            placeholderTextColor={colors.text.secondary}
            keyboardType="numeric"
            autoFocus
          />
          <Pressable
            style={[styles.priceButton, { backgroundColor: colors.primary }]}
            onPress={handleMarkPurchased}
          >
            <Text
              style={[styles.priceButtonText, { color: colors.text.inverse }]}
            >
              Done
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  itemLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  itemQuantity: { fontSize: 14 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 8, borderRadius: 6 },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  priceTextInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  priceButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  priceButtonText: { fontSize: 14, fontWeight: '600' },
});
