import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useMall } from '../../context/mall/MallContext';
import { addMall } from '../../context/actions';
import { OperatingHours } from '../../components/OperatingHours';

// const { width } = Dimensions.get('window');

export default function NewMall() {
  const { colors } = useColorScheme();
  const { createMall } = useMall();
  const [errors, setErrors] = useState({});

  const [mallData, setMallData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    hours: {
      monday: { open: '09:00', close: '21:00', isClosed: false },
      tuesday: { open: '09:00', close: '21:00', isClosed: false },
      wednesday: { open: '09:00', close: '21:00', isClosed: false },
      thursday: { open: '09:00', close: '21:00', isClosed: false },
      friday: { open: '09:00', close: '21:00', isClosed: false },
      saturday: { open: '09:00', close: '21:00', isClosed: false },
      sunday: { open: '09:00', close: '21:00', isClosed: true },
    },
    storeTypes: [],
    description: '',
    amenities: [],
  });

  const validateForm = () => {
    const newErrors = {};
    if (!mallData.name.trim()) {
      newErrors.name = 'Mall name is required';
    }
    if (mallData.phone && !/^\+?[\d\s-]{10,}$/.test(mallData.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
    }
    if (mallData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mallData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (mallData.website && !isValidUrl(mallData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    // Validate operating hours
    const days = Object.keys(mallData.hours);
    const invalidHours = days.some((day) => {
      const { open, close, isClosed } = mallData.hours[day];
      if (!isClosed && (!isValidTime(open) || !isValidTime(close))) {
        return true;
      }
      return false;
    });

    if (invalidHours) {
      newErrors.hours = 'Invalid operating hours format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidTime = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      createMall({
        ...mallData,
      });
      Alert.alert('Success', 'Mall added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add mall');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Add New Mall',
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Mall Details
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text.primary },
                errors.name && styles.inputError,
              ]}
              value={mallData.name}
              onChangeText={(text) =>
                setMallData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Mall Name"
              placeholderTextColor={colors.text.secondary}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text.primary },
              ]}
              value={mallData.phone}
              onChangeText={(text) =>
                setMallData((prev) => ({ ...prev, phone: text }))
              }
              placeholder="Phone Number"
              placeholderTextColor={colors.text.secondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text.primary },
                errors.email && styles.inputError,
              ]}
              value={mallData.email}
              onChangeText={(text) =>
                setMallData((prev) => ({ ...prev, email: text }))
              }
              placeholder="Email Address"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text.primary },
                errors.website && styles.inputError,
              ]}
              value={mallData.website}
              onChangeText={(text) =>
                setMallData((prev) => ({ ...prev, website: text }))
              }
              placeholder="Website"
              placeholderTextColor={colors.text.secondary}
              autoCapitalize="none"
            />
            {errors.website && (
              <Text style={styles.errorText}>{errors.website}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Operating Hours
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <OperatingHours
              hours={mallData.hours}
              onUpdate={(newHours) =>
                setMallData((prev) => ({ ...prev, hours: newHours }))
              }
              editable={true}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.text.inverse }]}>
            Save Mall
          </Text>
        </Pressable>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
  card: {
    borderRadius: 12,
    padding: 16,
  },
});
