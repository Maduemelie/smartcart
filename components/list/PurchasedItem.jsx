import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const PurchasedItem = ({ item, onMoveBack, colors }) => (
  <View style={[styles.purchasedItemCard, { backgroundColor: colors.surface }]}>
    <View style={styles.itemContent}>
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.checkbox,
            styles.checkedBox,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
        </View>
        <View style={styles.itemInfo}>
          <Text
            style={[
              styles.itemName,
              styles.purchasedText,
              { color: colors.text.secondary },
            ]}
          >
            {item.name}
          </Text>
          <View style={styles.purchasedMeta}>
            <Text
              style={[styles.itemQuantity, { color: colors.text.secondary }]}
            >
              {item.quantity} {item.unit}
            </Text>
            {item.price != null && item.price > 0 && (
              <Text
                style={[styles.itemPrice, { color: colors.text.secondary }]}
              >
                ₦{item.price.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => onMoveBack(item.id)}
        style={styles.actionButton}
      >
        <Ionicons
          name="arrow-undo-outline"
          size={18}
          color={colors.text.secondary}
        />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  checkedBox: { borderWidth: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  itemQuantity: { fontSize: 14 },
  actionButton: { padding: 8, borderRadius: 6 },
  purchasedItemCard: {
    borderRadius: 8,
    marginBottom: 8,
    opacity: 0.7,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
  },
  purchasedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
});
