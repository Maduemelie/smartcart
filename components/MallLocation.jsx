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

const { width } = Dimensions.get('window');
const ASPECT_RATIO = width / 200;

export function MallLocation({ mall }) {
  const { colors } = useColorScheme();
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleNavigate = () => {
    if (!mall.coordinates && !mall.address) {
      setError('No location information available');
      return;
    }

    let url;
    if (mall.coordinates) {
      const scheme = Platform.select({
        ios: 'maps:',
        android: 'geo:',
      });
      const latLng = `${mall.coordinates.latitude},${mall.coordinates.longitude}`;
      const label = encodeURIComponent(mall.name);
      url = Platform.select({
        ios: `${scheme}${latLng}?q=${label}`,
        android: `${scheme}${latLng}?q=${label}`,
      });
    } else {
      const query = encodeURIComponent(`${mall.name} ${mall.address}`);
      url = Platform.select({
        ios: `maps://app?q=${query}`,
        android: `geo:0,0?q=${query}`,
      });
    }

    Linking.openURL(url).catch(() => {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {initialRegion && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={mall.coordinates}
              title={mall.name}
              description={mall.address}
            />
          </MapView>
        </View>
      )}

      <View style={styles.addressContainer}>
        <Ionicons name="location" size={20} color={Colors.primary} />
        <Text style={[styles.address, { color: colors.text.primary }]}>
          {mall.address || 'No address set'}
        </Text>
      </View>

      {distance && (
        <Text style={[styles.distance, { color: colors.text.secondary }]}>
          {distance} km away
        </Text>
      )}

      {error ? (
        <Text style={[styles.error, { color: Colors.error.main }]}>
          {error}
        </Text>
      ) : (
        <Pressable
          style={[styles.navigateButton, { backgroundColor: Colors.primary }]}
          onPress={handleNavigate}
        >
          <Ionicons name="navigate" size={20} color={Colors.text.inverse} />
          <Text style={[styles.navigationText, { color: Colors.text.inverse }]}>
            Navigate
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  address: {
    flex: 1,
    fontSize: 16,
  },
  distance: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  navigationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
});
