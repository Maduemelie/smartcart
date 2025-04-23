import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useMall } from '../context/mall/MallContext';
import { addStore, updateStore, deleteStore } from '../context/actions';

export function StoreManagement({ mallId, initialStore = null, onClose }) {
  const { dispatch } = useMall();
  const [errors, setErrors] = useState({});
  const [storeData, setStoreData] = useState(
    initialStore || {
      name: '',
      category: '',
      location: '',
      floor: '',
      contactNumber: '',
      description: '',
    }
  );

  const validateForm = () => {
    const newErrors = {};
    if (!storeData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    if (!storeData.category.trim()) {
      newErrors.category = 'Store category is required';
    }
    if (!storeData.location.trim()) {
      newErrors.location = 'Store location is required';
    }
    if (
      storeData.contactNumber &&
      !/^\+?[\d\s-]{10,}$/.test(storeData.contactNumber.trim())
    ) {
      newErrors.contactNumber = 'Invalid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      if (initialStore) {
        dispatch(updateStore(mallId, initialStore.id, storeData));
      } else {
        dispatch(addStore(mallId, storeData));
      }
      Alert.alert(
        'Success',
        `Store ${initialStore ? 'updated' : 'added'} successfully`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${initialStore ? 'update' : 'add'} store`
      );
    }
  };

  const handleDelete = () => {
    if (!initialStore) return;

    Alert.alert('Delete Store', 'Are you sure you want to delete this store?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteStore(mallId, initialStore.id));
          onClose();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {initialStore ? 'Edit Store' : 'Add New Store'}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={storeData.name}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Store Name"
            placeholderTextColor={Colors.text.secondary}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            value={storeData.category}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, category: text }))
            }
            placeholder="Category (e.g., Electronics, Fashion)"
            placeholderTextColor={Colors.text.secondary}
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            value={storeData.location}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, location: text }))
            }
            placeholder="Location in Mall"
            placeholderTextColor={Colors.text.secondary}
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={storeData.floor}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, floor: text }))
            }
            placeholder="Floor Level"
            placeholderTextColor={Colors.text.secondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.contactNumber && styles.inputError]}
            value={storeData.contactNumber}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, contactNumber: text }))
            }
            placeholder="Contact Number"
            placeholderTextColor={Colors.text.secondary}
            keyboardType="phone-pad"
          />
          {errors.contactNumber && (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={storeData.description}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, description: text }))
            }
            placeholder="Store Description"
            placeholderTextColor={Colors.text.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {initialStore && (
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Store
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, styles.saveButtonText]}>
            {initialStore ? 'Update Store' : 'Add Store'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error.main,
  },
  errorText: {
    color: Colors.error.main,
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error.main,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.text.inverse,
  },
  deleteButtonText: {
    color: Colors.text.inverse,
  },
});
