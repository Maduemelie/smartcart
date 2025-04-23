import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useMall } from '../context/mall/MallContext';
import { addMall, updateMall } from '../context/actions';

export function StoreManagement({ mallId, initialStore, onClose }) {
  const { colors } = useColorScheme();
  const { dispatch } = useMall();
  const [storeData, setStoreData] = useState(
    initialStore || {
      id: Date.now().toString(),
      name: '',
      location: '',
      category: '',
    }
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!storeData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    if (!storeData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (initialStore) {
      dispatch(updateMall(mallId, storeData));
    } else {
      dispatch(addMall(storeData));
    }
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {initialStore ? 'Edit Store' : 'Add Store'}
        </Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Store Name
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surface, color: colors.text.primary },
              errors.name && styles.inputError,
            ]}
            value={storeData.name}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Store Name"
            placeholderTextColor={colors.text.secondary}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Location
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surface, color: colors.text.primary },
              errors.location && styles.inputError,
            ]}
            value={storeData.location}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, location: text }))
            }
            placeholder="Location"
            placeholderTextColor={colors.text.secondary}
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Category (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surface, color: colors.text.primary },
            ]}
            value={storeData.category}
            onChangeText={(text) =>
              setStoreData((prev) => ({ ...prev, category: text }))
            }
            placeholder="Store Category"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.text.inverse }]}>
            Save Store
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
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
});
