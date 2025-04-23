import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useList } from '../../context/list/ListContext';
import { useMall } from '../../context/mall/MallContext';
import {
  addPriceRecord,
  addMall,
  updateLastVisited,
} from '../../context/actions';
import { Colors } from '../../constants/Colors';

// Simplified store section that treats store and mall as the same
const StoreSection = ({ selectedMall, colors }) => (
  <View style={[styles.storeSection, { backgroundColor: colors.surface }]}>
    <View style={styles.storeTitleRow}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Store Details
      </Text>
    </View>

    {selectedMall ? (
      <View style={styles.storeDisplay}>
        <Ionicons
          name="storefront-outline"
          size={20}
          color={colors.text.secondary}
        />
        <Text style={[styles.storeText, { color: colors.text.primary }]}>
          {selectedMall.name}
        </Text>
      </View>
    ) : (
      <Pressable
        style={[styles.selectMallButton, { borderColor: colors.primary }]}
        onPress={() => router.push('/malls')}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={[styles.selectMallText, { color: colors.primary }]}>
          Select or Add Mall
        </Text>
      </Pressable>
    )}
  </View>
);

const MallSelector = ({ selectedMall, onMallSelect, colors }) => {
  const { state: mallState } = useMall();
  const [showAll, setShowAll] = useState(false);

  const sortedMalls = useMemo(() => {
    return mallState.malls.sort((a, b) => {
      const aIsFavorite = mallState.favorites.includes(a.id);
      const bIsFavorite = mallState.favorites.includes(b.id);
      if (aIsFavorite !== bIsFavorite) return bIsFavorite ? 1 : -1;
      return (b.lastVisited || '').localeCompare(a.lastVisited || '');
    });
  }, [mallState.malls, mallState.favorites]);

  const displayMalls = showAll ? sortedMalls : sortedMalls.slice(0, 3);

  return (
    <View style={[styles.mallSection, { backgroundColor: colors.surface }]}>
      <View style={styles.mallSectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Select Mall
        </Text>
        {sortedMalls.length > 3 && (
          <Pressable onPress={() => setShowAll(!showAll)}>
            <Text style={[styles.showAllButton, { color: colors.primary }]}>
              {showAll ? 'Show Less' : 'Show All'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.mallList}>
        {displayMalls.map((mall) => (
          <Pressable
            key={mall.id}
            style={[
              styles.mallItem,
              selectedMall?.id === mall.id && {
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onMallSelect(mall)}
          >
            <View style={styles.mallInfo}>
              <Text style={[styles.mallName, { color: colors.text.primary }]}>
                {mall.name}
              </Text>
              {mall.location && (
                <Text
                  style={[
                    styles.mallLocation,
                    { color: colors.text.secondary },
                  ]}
                >
                  {mall.location}
                </Text>
              )}
            </View>
            {mallState.favorites.includes(mall.id) && (
              <Ionicons name="star" size={16} color={colors.primary} />
            )}
            {selectedMall?.id === mall.id && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default function ListDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useColorScheme();
  const { state: listState, updateList, addPurchaseToHistory } = useList();
  const { state: mallState, dispatch: mallDispatch } = useMall();

  const list = listState.lists.find((list) => list.id === id);
  const [purchasedItems, setPurchasedItems] = useState(
    list?.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.purchased || false,
      }),
      {}
    ) || {}
  );
  const [itemPrices, setItemPrices] = useState(
    list?.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.price || '',
      }),
      {}
    ) || {}
  );
  const [selectedMall, setSelectedMall] = useState(
    list?.mallId ? mallState.malls.find((m) => m.id === list.mallId) : null
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleTogglePurchased = (itemId) => {
    setPurchasedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    setHasChanges(true);
  };

  const handlePriceChange = (itemId, price) => {
    setItemPrices((prev) => ({
      ...prev,
      [itemId]: price,
    }));
    setHasChanges(true);
  };

  const handleMallSelect = (mall) => {
    setSelectedMall(mall);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (!selectedMall) {
      Alert.alert(
        'Warning',
        'No store selected. Selecting a store helps track prices and find the best deals.',
        [
          { text: 'Select Store', style: 'cancel' },
          { text: 'Save Anyway', onPress: () => saveChanges() },
        ]
      );
      return;
    }

    saveChanges();
  };

  const saveChanges = () => {
    const purchasedItemsList = list.items
      .filter((item) => purchasedItems[item.id])
      .map((item) => ({
        ...item,
        price: itemPrices[item.id] || '0',
        purchaseDate: new Date().toISOString(),
      }));

    if (purchasedItemsList.length > 0 && selectedMall) {
      purchasedItemsList.forEach((item) => {
        const price = Number(itemPrices[item.id]);
        if (price > 0) {
          mallDispatch(
            addPriceRecord(selectedMall.id, item.id, item.name, price)
          );
        }
      });

      addPurchaseToHistory(
        list.id,
        purchasedItemsList,
        totalPrice,
        selectedMall.id
      );
    }

    updateList(list.id, {
      ...list,
      items: list.items.map((item) => ({
        ...item,
        purchased: purchasedItems[item.id] || false,
        price: itemPrices[item.id] || item.price,
      })),
      mallId: selectedMall?.id,
      lastUpdated: new Date().toISOString(),
    });

    Alert.alert('Success', 'Changes saved successfully');
    router.back();
  };

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

        <View style={styles.itemsSection}>
          {list.items.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.itemRow, { backgroundColor: colors.surface }]}
              onPress={() => setHasChanges(true)}
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
                <TextInput
                  style={[styles.itemNameInput, { color: colors.text.primary }]}
                  value={item.name}
                  onChangeText={(value) =>
                    updateList(list.id, {
                      ...list,
                      items: list.items.map((i) =>
                        i.id === item.id ? { ...i, name: value } : i
                      ),
                    })
                  }
                  placeholder="Item name"
                  onFocus={() => setHasChanges(true)}
                />
                <View style={styles.itemMetaInputs}>
                  <TextInput
                    style={[
                      styles.quantityInput,
                      { color: colors.text.primary },
                    ]}
                    value={item.quantity}
                    onChangeText={(value) =>
                      updateList(list.id, {
                        ...list,
                        items: list.items.map((i) =>
                          i.id === item.id ? { ...i, quantity: value } : i
                        ),
                      })
                    }
                    keyboardType="numeric"
                    onFocus={() => setHasChanges(true)}
                  />
                  <TextInput
                    style={[styles.unitInput, { color: colors.text.primary }]}
                    value={item.unit}
                    onChangeText={(value) =>
                      updateList(list.id, {
                        ...list,
                        items: list.items.map((i) =>
                          i.id === item.id ? { ...i, unit: value } : i
                        ),
                      })
                    }
                    onFocus={() => setHasChanges(true)}
                  />
                </View>
              </View>

              {purchasedItems[item.id] && (
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
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <MallSelector
          selectedMall={selectedMall}
          onMallSelect={handleMallSelect}
          colors={colors}
        />

        <StoreSection selectedMall={selectedMall} colors={colors} />
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveChanges}
          >
            <Text
              style={[styles.saveButtonText, { color: colors.text.inverse }]}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
      )}
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
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    flex: 1,
    gap: 8,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editInput: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  quantityInput: {
    width: 60,
  },
  unitInput: {
    width: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  storeInput: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
  },
  storeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  storeSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  editListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemNameInput: {
    fontSize: 16,
    fontWeight: '500',
    padding: 4,
    marginBottom: 4,
  },
  itemMetaInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  storeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  storeText: {
    fontSize: 16,
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mallSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  mallSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  showAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  mallList: {
    gap: 8,
  },
  mallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  mallInfo: {
    flex: 1,
  },
  mallName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  mallLocation: {
    fontSize: 14,
  },
  selectMallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 8,
  },
  selectMallText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
