import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useList } from '../../../context/list/ListContext';
import { useMall } from '../../../context/mall/MallContext';
import { useColorScheme } from '../../../hooks/useColorScheme';

export default function History() {
  const { state } = useList();
  const { colors } = useColorScheme();
  const { state: mallState } = useMall();
  const { purchaseHistory } = state;
  console.log('Current List State:', state);
  console.log('Purchase History:', purchaseHistory);

  const renderHistoryItem = ({ item }) => {
    // Get list name for better UX
    const list = state.lists.find((l) => l.id === item.listId);
    // Get store name for better UX
    const store = mallState.malls.find((m) => m.id === item.storeId);

    return (
      <View style={[styles.historyCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.itemName, { color: colors.text.primary }]}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
            Qty: {item.quantity} {item.unit}
          </Text>
          {item.price && (
            <Text style={[styles.metaText, { color: colors.text.primary }]}>
              Price: ₦{item.price.toFixed(2)}
            </Text>
          )}
        </View>

        {list && (
          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
            List: {list.name}
          </Text>
        )}

        {item.storeId && (
          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
            Store: {store ? store.name : 'Unknown Store'}
          </Text>
        )}

        <Text style={[styles.date, { color: colors.text.secondary }]}>
          Purchased on: {new Date(item.datePurchased).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={purchaseHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.text.secondary }}>
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
    gap: 12,
  },
  historyCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});
