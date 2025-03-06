import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/ListContext';

export default function ListDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useColorScheme();
  const { state } = useList();

  // Add states for purchased items and prices
  const [purchasedItems, setPurchasedItems] = useState({});
  const [itemPrices, setItemPrices] = useState({});

  const list = state.lists.find((list) => list.id === id);

  // Add handlers
  const handleTogglePurchased = (itemId) => {
    setPurchasedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handlePriceChange = (itemId, price) => {
    setItemPrices((prev) => ({
      ...prev,
      [itemId]: price,
    }));
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
            <View
              key={item.id}
              style={[
                styles.itemRow,
                { backgroundColor: colors.surface },
                purchasedItems[item.id] && {
                  borderLeftColor: colors.primary,
                  borderLeftWidth: 3,
                },
              ]}
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
                <Text
                  style={[
                    styles.itemName,
                    { color: colors.text.primary },
                    purchasedItems[item.id] && styles.purchasedText,
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.itemMeta, { color: colors.text.secondary }]}
                >
                  {item.quantity} {item.unit}
                </Text>
              </View>

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
                  editable={purchasedItems[item.id]}
                />
              </View>
            </View>
          ))}
        </View>
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
});
