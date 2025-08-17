import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { calculateDistance } from '../utils/location';

export function MallLocation({ mall }) {
  console.log('MallLocation component rendered with mall:', mall);
  console.log('Mall coordinates:', mall?.coordinates);
  console.log(
    'Has coordinates:',
    !!(mall?.coordinates?.latitude && mall?.coordinates?.longitude)
  );
  const { colors } = useColorScheme();
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

  // Use mall.location as a fallback if mall.address is not available
  const addressToUse = mall.address || mall.coordinates || 'No address set';

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission required for distance calculation');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);

        if (mall.coordinates) {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            mall.coordinates.latitude,
            mall.coordinates.longitude
          );
          setDistance(distance);
        }
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Could not determine your location');
      }
    })();
  }, [mall]);

  const handleNavigate = () => {
    const hasCoordinates =
      mall.coordinates &&
      mall.coordinates.latitude &&
      mall.coordinates.longitude;
    const hasAddress = mall.address || null;

    if (!hasCoordinates && !hasAddress) {
      setError('No location information available');
      return;
    }

    let url;
    if (hasCoordinates) {
      // Use coordinates for precise navigation
      const scheme = Platform.select({
        ios: 'maps:',
        android: 'geo:',
      });
      const latLng = `${mall.coordinates.latitude},${mall.coordinates.longitude}`;
      const label = encodeURIComponent(mall.address);
      url = Platform.select({
        ios: `${scheme}${latLng}?q=${label}`,
        android: `${scheme}${latLng}?q=${label}`,
      });
    } else {
      // Use only the address without store name to avoid generic chain results
      const addressOnly = addressToUse.replace(mall.name, '').trim();
      const query = encodeURIComponent(addressOnly || addressToUse);
      url = Platform.select({
        ios: `maps://app?q=${query}`,
        android: `geo:0,0?q=${query}`,
      });
    }

    console.log('Navigation URL:', url);
    Linking.openURL(url).catch((error) => {
      console.error('Navigation error:', error);
      setError('Could not open maps application');
    });
  };

  const initialRegion = mall.coordinates
    ? {
        latitude: mall.coordinates.latitude,
        longitude: mall.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : null;

  console.log('Initial region:', initialRegion);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Map Section */}
      {initialRegion ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={mall.coordinates}
              title={mall.name}
              description={mall.address}
            >
              <View style={styles.customMarker}>
                <Ionicons name="storefront" size={20} color={Colors.primary} />
              </View>
            </Marker>
          </MapView>
        </View>
      ) : (
        /* Fallback when no coordinates */
        <View
          style={[
            styles.mapContainer,
            styles.noMapContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.noMapContent}>
            <Ionicons
              name="map-outline"
              size={48}
              color={colors.text.secondary}
            />
            <Text style={[styles.noMapText, { color: colors.text.secondary }]}>
              Map unavailable
            </Text>
            <Text
              style={[styles.noMapSubtext, { color: colors.text.secondary }]}
            >
              {mall.address
                ? 'Location not precisely mapped'
                : 'No address provided'}
            </Text>
          </View>
        </View>
      )}

      {/* Address Section */}
      <View style={styles.addressContainer}>
        <View style={styles.locationIconContainer}>
          <Ionicons
            name={initialRegion ? 'location' : 'location-outline'}
            size={20}
            color={initialRegion ? Colors.primary : colors.text.secondary}
          />
        </View>
        <View style={styles.addressContent}>
          <Text style={[styles.address, { color: colors.text.primary }]}>
            {mall.address || 'No address set'}
          </Text>
          {!initialRegion && mall.address && (
            <Text
              style={[styles.addressNote, { color: colors.text.secondary }]}
            >
              Use Google Places autocomplete when adding stores for precise
              mapping
            </Text>
          )}
        </View>
      </View>

      {/* Distance Section */}
      {distance && (
        <View style={styles.distanceContainer}>
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={[styles.distance, { color: colors.text.secondary }]}>
            {distance} km away
          </Text>
        </View>
      )}

      {/* Action Section */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="warning-outline"
            size={20}
            color={Colors.error.main}
          />
          <Text style={[styles.error, { color: Colors.error.main }]}>
            {error}
          </Text>
        </View>
      ) : (
        <Pressable
          style={[styles.navigateButton, { backgroundColor: Colors.primary }]}
          onPress={handleNavigate}
        >
          <Ionicons name="navigate" size={20} color={Colors.text.inverse} />
          <Text style={[styles.navigationText, { color: Colors.text.inverse }]}>
            {initialRegion ? 'Navigate to Store' : 'Search Address'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noMapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  noMapContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMapText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  noMapSubtext: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  locationIconContainer: {
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  addressNote: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    margin: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  navigationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
  },
});
