import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useMall } from '../../context/mall/MallContext';
import { addMall } from '../../context/actions';
import { OperatingHours } from '../../components/OperatingHours';

const { width } = Dimensions.get('window');
const ASPECT_RATIO = width / 200; // Height will be 200dp

export default function NewMall() {
  const { colors } = useColorScheme();
  const { dispatch } = useMall();
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 6.5244, // Default to Lagos, Nigeria
    longitude: 3.3792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0922 * ASPECT_RATIO,
  });

  const [mallData, setMallData] = useState({
    name: '',
    location: '',
    coordinates: null,
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
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to pick mall location'
        );
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        setLocation(currentLocation);
        setMapRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!mallData.name.trim()) {
      newErrors.name = 'Mall name is required';
    }
    if (!mallData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!mallData.coordinates) {
      newErrors.location = 'Please select a location on the map';
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

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address) {
        const locationString = [
          address.street,
          address.district,
          address.city,
          address.region,
        ]
          .filter(Boolean)
          .join(', ');

        setMallData((prev) => ({
          ...prev,
          location: locationString,
          coordinates: { latitude, longitude },
        }));
      }
    } catch (error) {
      console.log('Error getting address:', error);
    }
  };

  const handleLocationSearch = async (text) => {
    setMallData((prev) => ({ ...prev, location: text }));

    try {
      const results = await Location.geocodeAsync(text);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922 * ASPECT_RATIO,
        });
        setMallData((prev) => ({
          ...prev,
          coordinates: { latitude, longitude },
        }));
      }
    } catch (error) {
      console.log('Error searching location:', error);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      dispatch(
        addMall({
          ...mallData,
          location: {
            address: mallData.location,
            coordinates: mallData.coordinates,
          },
        })
      );
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

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Location
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={mapRegion}
                onPress={handleMapPress}
              >
                {mallData.coordinates && (
                  <Marker
                    coordinate={mallData.coordinates}
                    title={mallData.name || 'Selected Location'}
                  />
                )}
              </MapView>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  },
                  errors.location && styles.inputError,
                ]}
                value={mallData.location}
                onChangeText={handleLocationSearch}
                placeholder="Search or enter location"
                placeholderTextColor={colors.text.secondary}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>
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
  mapContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  map: {
    width: '100%',
    height: 200,
  },
});
