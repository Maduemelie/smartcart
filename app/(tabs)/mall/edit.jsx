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
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useMall } from '../../../context/mall/MallContext';
import { updateMall } from '../../../context/actions';
import { OperatingHours } from '../../../components/OperatingHours';

export default function EditMall() {
  const { colors } = useColorScheme();
  const { id } = useLocalSearchParams();
  const { state, dispatch } = useMall();
  const [errors, setErrors] = useState({});

  const mall = state.malls.find((m) => m.id === id);

  const [mallData, setMallData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    hours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '09:00', close: '21:00' },
    },
  });

  useEffect(() => {
    if (mall) {
      setMallData({
        name: mall.name || '',
        location: mall.location || '',
        phone: mall.phone || '',
        email: mall.email || '',
        website: mall.website || '',
        hours: mall.hours || mallData.hours,
      });
    }
  }, [mall]);

  const validateForm = () => {
    const newErrors = {};
    if (!mallData.name.trim()) {
      newErrors.name = 'Mall name is required';
    }
    if (!mallData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (mallData.email && !mallData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    if (mallData.website && !mallData.website.startsWith('http')) {
      newErrors.website = 'Website should start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      dispatch(updateMall(id, mallData));
      Alert.alert('Success', 'Mall updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update mall');
    }
  };

  if (!mall) {
    return (
      <View style={styles.notFound}>
        <Text style={{ color: colors.text.primary }}>Mall not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Edit Mall',
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
                errors.location && styles.inputError,
              ]}
              value={mallData.location}
              onChangeText={(text) =>
                setMallData((prev) => ({ ...prev, location: text }))
              }
              placeholder="Location"
              placeholderTextColor={colors.text.secondary}
            />
            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}
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
            Save Changes
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
});
