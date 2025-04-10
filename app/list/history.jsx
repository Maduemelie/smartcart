import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useList } from '../../context/list/ListContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function History() {
  const { state } = useList();
  const { colors } = useColorScheme();
  const { purchaseHistory } = state;

  const renderHistoryItem = ({ item }) => (
    <View style={[styles.historyCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.listName, { color: colors.text.primary }]}>
        {item.listName || 'Shopping List'}
      </Text>
      <Text style={[styles.date, { color: colors.text.secondary }]}>
        {new Date(item.purchaseDate).toLocaleDateString()}
      </Text>
      <Text style={[styles.store, { color: colors.text.primary }]}>
        {item.storeName || 'Store not specified'}
      </Text>

      <View style={styles.itemsList}>
        {item.items.map((purchasedItem) => (
          <View key={purchasedItem.id} style={styles.purchasedItem}>
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: colors.text.primary }]}>
                {purchasedItem.name}
              </Text>
              <Text
                style={[styles.itemQuantity, { color: colors.text.secondary }]}
              >
                {purchasedItem.quantity} {purchasedItem.unit}
              </Text>
            </View>
            <Text style={[styles.itemPrice, { color: colors.text.primary }]}>
              ₦{purchasedItem.price}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.total, { color: colors.primary }]}>
        Total: ₦{item.totalAmount}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Purchase History',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
        }}
      />

      <FlatList
        data={purchaseHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No purchase history yet
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  historyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  store: {
    fontSize: 16,
    marginBottom: 12,
  },
  itemsList: {
    marginTop: 8,
    gap: 8,
  },
  purchasedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 80,
    textAlign: 'right',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});
