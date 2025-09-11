import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useMall } from '../../../context/mall/MallContext';
import { OperatingHours } from '../../../components/OperatingHours';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function NewMall() {
  const { colors } = useColorScheme();
  const { createMall, state } = useMall();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [mallData, setMallData] = useState({
    name: '',
    address: '',
    coordinates: null,
    phone: '',
    email: '',
    website: '',
    description: '',
    category: 'shopping_mall',
    isFavorite: false,
    hours: {
      monday: { open: '09:00', close: '21:00', isClosed: false },
      tuesday: { open: '09:00', close: '21:00', isClosed: false },
      wednesday: { open: '09:00', close: '21:00', isClosed: false },
      thursday: { open: '09:00', close: '21:00', isClosed: false },
      friday: { open: '09:00', close: '21:00', isClosed: false },
      saturday: { open: '09:00', close: '21:00', isClosed: false },
      sunday: { open: '10:00', close: '20:00', isClosed: false },
    },
    amenities: [],
    tags: [],
    parkingAvailable: true,
    wheelchairAccessible: true,
    hasRestrooms: true,
    hasFoodCourt: false,
    hasATM: true,
    wifiAvailable: false,
  });

  // Store categories for selection
  const storeCategories = [
    { id: 'shopping_mall', name: 'Shopping Mall', icon: 'storefront-outline' },
    { id: 'supermarket', name: 'Supermarket', icon: 'basket-outline' },
    {
      id: 'department_store',
      name: 'Department Store',
      icon: 'business-outline',
    },
    { id: 'grocery_store', name: 'Grocery Store', icon: 'nutrition-outline' },
    { id: 'pharmacy', name: 'Pharmacy', icon: 'medical-outline' },
    {
      id: 'electronics',
      name: 'Electronics Store',
      icon: 'phone-portrait-outline',
    },
    { id: 'clothing', name: 'Clothing Store', icon: 'shirt-outline' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline' },
  ];

  // Amenities options
  const amenityOptions = [
    { id: 'parking', name: 'Parking', icon: 'car-outline' },
    {
      id: 'wheelchair',
      name: 'Wheelchair Accessible',
      icon: 'accessibility-outline',
    },
    { id: 'restrooms', name: 'Restrooms', icon: 'person-outline' },
    { id: 'food_court', name: 'Food Court', icon: 'restaurant-outline' },
    { id: 'atm', name: 'ATM', icon: 'card-outline' },
    { id: 'wifi', name: 'Free WiFi', icon: 'wifi-outline' },
    {
      id: 'customer_service',
      name: 'Customer Service',
      icon: 'help-circle-outline',
    },
    { id: 'gift_wrapping', name: 'Gift Wrapping', icon: 'gift-outline' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!mallData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    const existingMall = state.malls.find(
      (mall) =>
        mall.name.toLowerCase().trim() === mallData.name.toLowerCase().trim()
    );
    if (existingMall) {
      newErrors.name = 'A store with this name already exists';
    }

    if (!mallData.address.trim() && !mallData.coordinates) {
      newErrors.address = 'Store location is required';
    }

    if (
      mallData.phone &&
      !/^\+?[\d\s\-\(\)]{10,}$/.test(mallData.phone.trim())
    ) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (mallData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mallData.email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (mallData.website && !isValidUrl(mallData.website)) {
      newErrors.website = 'Invalid website URL format';
    }

    const days = Object.keys(mallData.hours);
    const invalidHours = days.some((day) => {
      const { open, close, isClosed } = mallData.hours[day];
      if (!isClosed && (!isValidTime(open) || !isValidTime(close))) {
        return true;
      }
      if (!isClosed && open >= close) {
        return true;
      }
      return false;
    });

    if (invalidHours) {
      newErrors.hours =
        'Invalid operating hours - check time format and ensure opening time is before closing time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidTime = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const isValidUrl = (url) => {
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newMall = {
        ...mallData,
        id: `mall_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastVisited: null,
        visitCount: 0,
        website:
          mallData.website && !mallData.website.startsWith('http')
            ? `https://${mallData.website}`
            : mallData.website,
      };

      await createMall(newMall);

      Alert.alert('Success', `${mallData.name} has been added successfully!`, [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating mall:', error);
      Alert.alert('Error', 'Failed to add store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (data, details = null) => {
    console.log('Location selected:', { data, details });

    try {
      // Extract address from the data object
      const selectedAddress =
        data.description ||
        data.structured_formatting?.main_text ||
        data.terms?.[0]?.value ||
        '';

      console.log('Extracted address:', selectedAddress);
      console.log('Raw coordinates:', details?.geometry?.location);

      // Update mall data with selected address
      const coordinates = details?.geometry?.location
        ? {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          }
        : null;

      console.log('Converted coordinates:', coordinates);

      setMallData((prev) => ({
        ...prev,
        address: selectedAddress,
        coordinates: coordinates,
      }));

      // Clear any address errors
      if (errors.address) {
        setErrors((prev) => ({ ...prev, address: null }));
      }

      // Close the modal after selection
      setShowAddressModal(false);
    } catch (error) {
      console.error('Error in handleLocationSelect:', error);
      Alert.alert('Error', 'Failed to select location. Please try again.');
    }
  };

  const toggleAmenity = (amenityId) => {
    setMallData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const updateField = (field, value) => {
    setMallData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  useEffect(() => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY) {
      Alert.alert(
        'Configuration Notice',
        'Google Maps API key is not configured. You can still add stores manually by typing the address.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Add New Store',
          headerShadowVisible: false,
        }}
      />

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Basic Information
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Store Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: errors.name ? Colors.error.main : colors.border,
                },
              ]}
              value={mallData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Enter store name"
              placeholderTextColor={colors.text.secondary}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Store Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {storeCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        mallData.category === category.id
                          ? colors.primary
                          : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => updateField('category', category.id)}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={
                      mallData.category === category.id
                        ? colors.text.inverse
                        : colors.text.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          mallData.category === category.id
                            ? colors.text.inverse
                            : colors.text.primary,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Ionicons
                  name={mallData.isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={
                    mallData.isFavorite ? colors.error : colors.text.secondary
                  }
                />
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  Mark as Favorite
                </Text>
              </View>
              <Switch
                value={mallData.isFavorite}
                onValueChange={(value) => updateField('isFavorite', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Location Information
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Address *
            </Text>
            {GOOGLE_MAPS_API_KEY ? (
              <Pressable
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: errors.address
                      ? Colors.error.main
                      : colors.border,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setShowAddressModal(true)}
              >
                <Text
                  style={{
                    color: mallData.address
                      ? colors.text.primary
                      : colors.text.secondary,
                    fontSize: 16,
                    flex: 1,
                  }}
                >
                  {mallData.address || 'Search for store location'}
                </Text>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.text.secondary}
                />
              </Pressable>
            ) : (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                    borderColor: errors.address
                      ? Colors.error.main
                      : colors.border,
                  },
                ]}
                value={mallData.address}
                onChangeText={(text) => updateField('address', text)}
                placeholder="Enter store address manually"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={2}
              />
            )}
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Contact Information
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: errors.phone ? Colors.error.main : colors.border,
                },
              ]}
              value={mallData.phone}
              onChangeText={(text) => updateField('phone', text)}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.text.secondary}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Email Address
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: errors.email ? Colors.error.main : colors.border,
                },
              ]}
              value={mallData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="store@example.com"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Website
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: errors.website
                    ? Colors.error.main
                    : colors.border,
                },
              ]}
              value={mallData.website}
              onChangeText={(text) => updateField('website', text)}
              placeholder="www.store.com"
              placeholderTextColor={colors.text.secondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.website && (
              <Text style={styles.errorText}>{errors.website}</Text>
            )}
          </View>
        </View>

        {/* Operating Hours Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Operating Hours
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <OperatingHours
              hours={mallData.hours}
              onUpdate={(newHours) => updateField('hours', newHours)}
              editable={true}
            />
            {errors.hours && (
              <Text style={[styles.errorText, { marginTop: 8 }]}>
                {errors.hours}
              </Text>
            )}
          </View>
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Amenities & Features
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.text.secondary }]}
          >
            Select all amenities available at this store
          </Text>

          <View style={styles.amenitiesGrid}>
            {amenityOptions.map((amenity) => (
              <Pressable
                key={amenity.id}
                style={[
                  styles.amenityButton,
                  {
                    backgroundColor: mallData.amenities.includes(amenity.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleAmenity(amenity.id)}
              >
                <Ionicons
                  name={amenity.icon}
                  size={24}
                  color={
                    mallData.amenities.includes(amenity.id)
                      ? colors.text.inverse
                      : colors.text.primary
                  }
                />
                <Text
                  style={[
                    styles.amenityText,
                    {
                      color: mallData.amenities.includes(amenity.id)
                        ? colors.text.inverse
                        : colors.text.primary,
                    },
                  ]}
                >
                  {amenity.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Additional Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Additional Information
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: colors.border,
                },
              ]}
              value={mallData.description}
              onChangeText={(text) => updateField('description', text)}
              placeholder="Add any additional notes about this store..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Summary Section */}
        <View style={[styles.section, styles.summarySection]}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text.primary }]}>
              Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text
                style={[styles.summaryLabel, { color: colors.text.secondary }]}
              >
                Store Name:
              </Text>
              <Text
                style={[styles.summaryValue, { color: colors.text.primary }]}
              >
                {mallData.name || 'Not specified'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text
                style={[styles.summaryLabel, { color: colors.text.secondary }]}
              >
                Type:
              </Text>
              <Text
                style={[styles.summaryValue, { color: colors.text.primary }]}
              >
                {storeCategories.find((cat) => cat.id === mallData.category)
                  ?.name || 'Not selected'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text
                style={[styles.summaryLabel, { color: colors.text.secondary }]}
              >
                Location:
              </Text>
              <Text
                style={[styles.summaryValue, { color: colors.text.primary }]}
                numberOfLines={2}
              >
                {mallData.address || 'Not specified'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text
                style={[styles.summaryLabel, { color: colors.text.secondary }]}
              >
                Amenities:
              </Text>
              <Text
                style={[styles.summaryValue, { color: colors.text.primary }]}
              >
                {mallData.amenities.length} selected
              </Text>
            </View>
            {mallData.isFavorite && (
              <View style={styles.favoriteIndicator}>
                <Ionicons name="heart" size={16} color={colors.error} />
                <Text style={[styles.favoriteText, { color: colors.error }]}>
                  Marked as Favorite
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor: isSubmitting ? colors.border : colors.primary,
              opacity: isSubmitting ? 0.6 : 1,
            },
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <Text
                style={[styles.saveButtonText, { color: colors.text.inverse }]}
              >
                Saving...
              </Text>
            </View>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.text.inverse}
              />
              <Text
                style={[styles.saveButtonText, { color: colors.text.inverse }]}
              >
                Save Store
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Select Address
            </Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.modalContent}>
            {GOOGLE_MAPS_API_KEY ? (
              <GooglePlacesAutocomplete
                placeholder="Search for store location"
                onPress={handleLocationSelect}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  types: 'establishment',
                }}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
                debounce={300}
                minLength={2}
                fetchDetails={true}
                enablePoweredByContainer={false}
                keepResultsAfterBlur={false}
                listViewDisplayed="auto"
                textInputProps={{
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  onFocus: () => console.log('GooglePlaces focused'),
                  onBlur: () => console.log('GooglePlaces blurred'),
                }}
                styles={{
                  container: {
                    flex: 0,
                    zIndex: 1,
                  },
                  textInputContainer: {
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.address
                      ? Colors.error.main
                      : colors.border,
                    paddingHorizontal: 0,
                  },
                  textInput: {
                    backgroundColor: 'transparent',
                    color: colors.text.primary,
                    fontSize: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    margin: 0,
                    minHeight: 56,
                  },
                  listView: {
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    marginTop: 4,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    maxHeight: 200,
                  },
                  row: {
                    backgroundColor: colors.surface,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                  description: {
                    color: colors.text.primary,
                    fontSize: 14,
                  },
                  predefinedPlacesDescription: {
                    color: colors.text.secondary,
                  },
                  separator: {
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.border,
                  },
                }}
              />
            ) : (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                    borderColor: errors.address
                      ? Colors.error.main
                      : colors.border,
                  },
                ]}
                value={mallData.address}
                onChangeText={(text) => updateField('address', text)}
                placeholder="Enter store address manually"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={2}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 100,
  },
  errorText: {
    color: Colors.error.main,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryScroll: {
    marginVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    minWidth: '45%',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summarySection: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  favoriteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  favoriteText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  noApiKeyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noApiKeyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  manualEntryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  manualEntryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
