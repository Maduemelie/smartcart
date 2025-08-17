import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SelectStoreModal = ({
  visible,
  onClose,
  onSelect,
  malls,
  colors,
  router,
}) => {
  const handleGoToAddStore = () => {
    onClose();
    router.push('/mall/new');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose} // For Android back button
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* This inner Pressable prevents the modal from closing when its content is pressed */}
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            Select a Store
          </Text>
          <FlatList
            data={malls}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.storeItem, { borderBottomColor: colors.border }]}
                onPress={() => onSelect(item.id)}
              >
                <Text
                  style={[styles.storeItemText, { color: colors.text.primary }]}
                >
                  {item.name}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="storefront-outline"
                  size={48}
                  color={colors.text.secondary}
                />
                <Text
                  style={[styles.emptyTitle, { color: colors.text.primary }]}
                >
                  No Stores Found
                </Text>
                <Text
                  style={[styles.emptyText, { color: colors.text.secondary }]}
                >
                  Add a store to begin selecting where you're shopping.
                </Text>
                <Pressable
                  style={[
                    styles.emptyButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleGoToAddStore}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.text.inverse },
                    ]}
                  >
                    Add a Store
                  </Text>
                </Pressable>
              </View>
            }
          />
          <Pressable
            style={[
              styles.modalButton,
              {
                marginTop: 16,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[styles.modalButtonText, { color: colors.text.primary }]}
            >
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
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
    maxHeight: '70%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  storeItemText: {
    fontSize: 16,
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
});
