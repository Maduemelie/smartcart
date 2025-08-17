import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  SafeAreaView,
  // TextInput,
  // Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../../context/list/ListContext';
import { useMall } from '../../context/mall/MallContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { QuickAddModal } from '../../components/list/QuickAddModal';
import { EditItemModal } from '../../components/list/EditItemModal';
import { SelectStoreModal } from '../../components/list/SelectStoreModal';
import { ShoppingItem } from '../../components/list/ShoppingItem';
import { PurchasedItem } from '../../components/list/PurchasedItem';
import { useStoreRecommendation } from '../../hooks/useStoreRecommendation';
import { RecommendationBanner } from '../../components/list/RecommendationBanner';

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    getListById,
    getListItems,
    getPurchasedItems,
    getListStats,
    addItem,
    updateItem,
    removeItem,
    moveItemToPurchased,
    // updateList,
    moveItemToShoppingList,
  } = useList();
  const { state: mallState } = useMall();
  const { colors } = useColorScheme();

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const currentList = getListById(id);
  const shoppingItems = getListItems(id);
  const purchasedItems = getPurchasedItems(id);
  const stats = getListStats(id);

  // Recommendation Engine Hook
  const {
    recommendation,
    isLoading: isRecommendationLoading,
    error: recommendationError,
  } = useStoreRecommendation(currentList);

  const selectedStore = selectedStoreId
    ? mallState.malls.find((m) => m.id === selectedStoreId)
    : null;

  console.log('Current list:', currentList);
  console.log('Shopping items:', shoppingItems);
  console.log('Purchased items:', purchasedItems);

  if (!currentList) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={[styles.errorText, { color: colors.text.primary }]}>
          List not found
        </Text>
      </SafeAreaView>
    );
  }

  const handleMarkPurchased = (itemId, price = 0) => {
    console.log(
      'Moving item to purchased:',
      itemId,
      price,
      'at store:',
      selectedStoreId
    );
    moveItemToPurchased(
      id,
      itemId,
      selectedStoreId,
      price,
      selectedStore?.name
    );
  };

  const handleMoveBack = (itemId) => {
    console.log('Move back pressed for:', itemId);
    Alert.alert(
      'Move Back',
      'This item will be moved back to your shopping list',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move',
          onPress: () => {
            console.log('Move back confirmed for:', itemId);
            moveItemToShoppingList(id, itemId); // This triggers the full move logic
          },
        },
      ]
    );
  };

  const handleAddItem = (itemData) => {
    console.log('Adding item:', itemData);
    addItem(id, itemData);
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item);
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEditedItem = (itemId, updates) => {
    console.log('Saving edited item:', itemId, updates);
    updateItem(id, itemId, updates);
    setEditingItem(null);
    setShowEditModal(false);
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
    setShowEditModal(false);
  };

  const handleDeleteItem = (itemId) => {
    console.log('Delete item:', itemId);
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          console.log('Delete confirmed for:', itemId);
          removeItem(id, itemId);
        },
      },
    ]);
  };

  const handleEditList = () => {
    console.log('Edit list pressed');
    Alert.alert('Edit List', 'Edit list functionality', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => console.log('Edit list confirmed') },
    ]);
  };

  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setShowStoreModal(false);
  };

  const progressPercentage =
    stats.totalItems > 0 ? (stats.purchasedItems / stats.totalItems) * 100 : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={[styles.listTitle, { color: colors.text.primary }]}>
            {currentList.name}
          </Text>
          <Pressable onPress={handleEditList} style={styles.editButton}>
            <Ionicons
              name="create-outline"
              size={22}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text
              style={[styles.progressText, { color: colors.text.secondary }]}
            >
              {stats.purchasedItems} of {stats.totalItems} items purchased
            </Text>
            <Text
              style={[styles.progressPercentage, { color: colors.primary }]}
            >
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Store Selector Section */}
        <Pressable
          style={[styles.storeSelector, { borderColor: colors.border }]}
          onPress={() => setShowStoreModal(true)}
        >
          <Ionicons
            name={selectedStore ? 'storefront' : 'storefront-outline'}
            size={20}
            color={selectedStore ? colors.primary : colors.text.secondary}
          />
          <Text
            style={[
              styles.storeSelectorText,
              {
                color: selectedStore
                  ? colors.text.primary
                  : colors.text.secondary,
              },
            ]}
            numberOfLines={1}
          >
            {selectedStore
              ? `Shopping at: ${selectedStore.name}`
              : 'Select a store to begin'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* Recommendation Banner */}
      <RecommendationBanner
        recommendation={recommendation}
        isLoading={isRecommendationLoading}
        error={recommendationError}
      />

      {/* Shopping Items */}
      <FlatList
        data={shoppingItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShoppingItem
            item={item}
            onMarkPurchased={handleMarkPurchased}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            colors={colors}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons
              name="checkmark-circle"
              size={48}
              color={colors.primary}
            />
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>
              {purchasedItems.length > 0
                ? 'All items purchased!'
                : 'No items in this list yet'}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Purchased Items Section */}
      {purchasedItems.length > 0 && (
        <View
          style={[styles.purchasedSection, { backgroundColor: colors.surface }]}
        >
          <Pressable
            style={styles.purchasedHeader}
            onPress={() => setShowPurchased(!showPurchased)}
          >
            <Text
              style={[styles.purchasedTitle, { color: colors.text.secondary }]}
            >
              Recent Purchases ({purchasedItems.length})
            </Text>
            <Ionicons
              name={showPurchased ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.secondary}
            />
          </Pressable>

          {showPurchased && (
            <FlatList
              data={purchasedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PurchasedItem
                  item={item}
                  onMoveBack={handleMoveBack}
                  colors={colors}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      )}

      {/* Floating Add Button */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {
          console.log('FAB pressed');
          setShowQuickAdd(true);
        }}
      >
        <Ionicons name="add" size={24} color={colors.text.inverse} />
      </Pressable>

      {/* Quick Add Modal */}
      <QuickAddModal
        visible={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={handleAddItem}
        colors={colors}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        visible={showEditModal}
        onClose={handleCloseEditModal}
        item={editingItem}
        onSave={handleSaveEditedItem}
        colors={colors}
      />

      <SelectStoreModal
        visible={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onSelect={handleSelectStore}
        malls={mallState.malls}
        router={router}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  listTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  listContent: {
    padding: 16,
  },
  purchasedSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  purchasedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  purchasedTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  storeSelectorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
