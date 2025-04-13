import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export function MallLocation({ mall }) {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);

        if (mall.latitude && mall.longitude) {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            mall.latitude,
            mall.longitude
          );
          setDistance(distance);
        }
      } catch (err) {
        setError('Error getting location');
      }
    })();
  }, [mall]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const openMapsNavigation = () => {
    if (!mall.latitude || !mall.longitude) {
      return;
    }

    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const latLng = `${mall.latitude},${mall.longitude}`;
    const label = mall.name;
    const url = Platform.select({
      ios: `${scheme}${latLng}?q=${label}`,
      android: `${scheme}${latLng}?q=${label}`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationInfo}>
        <Ionicons name="location" size={20} color={Colors.primary} />
        <Text style={styles.address}>
          {mall.address || 'Address not provided'}
        </Text>
      </View>

      {distance && <Text style={styles.distance}>{distance} km away</Text>}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Pressable style={styles.navigationButton} onPress={openMapsNavigation}>
          <Ionicons name="navigate" size={20} color={Colors.text.inverse} />
          <Text style={styles.navigationText}>Navigate</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginTop: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  address: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  distance: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  navigationText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: Colors.error.main,
    fontSize: 14,
    textAlign: 'center',
  },
});
