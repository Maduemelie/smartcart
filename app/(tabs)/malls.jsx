import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useMall } from '../../context/mall/MallContext';
import { setMallFavorite } from '../../context/actions';
import { calculateDistance } from '../../utils/location';

// Store category icons mapping
const categoryIcons = {
  shopping_mall: 'storefront',
  supermarket: 'basket',
  department_store: 'business',
  grocery_store: 'nutrition',
  pharmacy: 'medical',
  electronics: 'phone-portrait',
  clothing: 'shirt',
  other: 'ellipsis-horizontal',
};

export default function Malls() {
  const { colors } = useColorScheme();
  const { state, dispatch } = useMall();
  const { malls, favorites } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [filteredMalls, setFilteredMalls] = useState(malls);

  // Get user location on component mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          setLocationError(null);
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 10000,
          });
          setUserLocation(location.coords);
          console.log('User location obtained:', location.coords);
        } else {
          setLocationError('Location permission denied');
          console.log('Location permission denied');
        }
      } catch (error) {
        console.log('Error getting location:', error);
        setLocationError(error.message || 'Failed to get location');
      }
    })();
  }, []);

  // Filter malls based on search query
  useEffect(() => {
    let sortedMalls = [...malls];

    // Sort by favorite status and then by distance
    if (userLocation) {
      sortedMalls.sort((a, b) => {
        const aIsFavorite = favorites.includes(a.id);
        const bIsFavorite = favorites.includes(b.id);

        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;

        const distA = getMallDistance(a);
        const distB = getMallDistance(b);

        if (distA !== null && distB !== null) {
          return distA - distB;
        }
        return 0;
      });
    }

    if (!searchQuery.trim()) {
      setFilteredMalls(sortedMalls);
    } else {
      const filtered = sortedMalls.filter(
        (mall) =>
          mall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (mall.address &&
            mall.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMalls(filtered);
    }
  }, [searchQuery, malls, favorites, userLocation, getMallDistance]);

  const handleAddMall = useCallback(() => {
    router.push('/mall/new');
  }, []);

  const handlePressMall = useCallback((mallId) => {
    router.push(`/mall/${mallId}`);
  }, []);

  const toggleFavorite = useCallback(
    (mallId, event) => {
      event?.stopPropagation();
      const isFavorite = favorites.includes(mallId);
      dispatch(setMallFavorite(mallId, !isFavorite));
    },
    [favorites, dispatch]
  );

  const getMallDistance = useCallback(
    (mall) => {
      if (!userLocation || !mall.coordinates) return null;
      return calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        mall.coordinates.latitude,
        mall.coordinates.longitude
      );
    },
    [userLocation, calculateDistance]
  );

  const renderMallCard = (mall) => {
    const distance = getMallDistance(mall);
    const isFavorite = favorites.includes(mall.id);
    const categoryIcon = categoryIcons[mall.category] || 'storefront';

    return (
      <Pressable
        key={mall.id}
        style={({ pressed }) => [
          styles.mallCard,
          {
            backgroundColor: colors.surface,
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={() => handlePressMall(mall.id)}
      >
        {/* Header with category icon and favorite */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: colors.primary + '15' },
            ]}
          >
            <Ionicons name={categoryIcon} size={24} color={colors.primary} />
          </View>
          <Pressable
            onPress={(e) => toggleFavorite(mall.id, e)}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.error : colors.text.secondary}
            />
          </Pressable>
        </View>

        {/* Mall info */}
        <View style={styles.mallInfo}>
          <Text style={[styles.mallName, { color: colors.text.primary }]}>
            {mall.name}
          </Text>

          {/* Address with location icon */}
          {mall.address && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.text.secondary}
              />
              <Text
                style={[styles.mallAddress, { color: colors.text.secondary }]}
                numberOfLines={2}
              >
                {mall.address}
              </Text>
            </View>
          )}

          {/* Distance and last visited */}
          <View style={styles.metaRow}>
            {/* Distance display with fallback states */}
            {distance ? (
              <View style={styles.distanceTag}>
                <Ionicons
                  name="navigate-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.distanceText, { color: colors.primary }]}>
                  {distance} km
                </Text>
              </View>
            ) : mall.coordinates && !userLocation ? (
              <View
                style={[
                  styles.distanceTag,
                  { backgroundColor: colors.text.secondary + '20' },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text
                  style={[
                    styles.distanceText,
                    { color: colors.text.secondary },
                  ]}
                >
                  {locationError
                    ? 'Location unavailable'
                    : 'Getting location...'}
                </Text>
              </View>
            ) : !mall.coordinates ? (
              <View
                style={[
                  styles.distanceTag,
                  { backgroundColor: colors.text.secondary + '10' },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text
                  style={[
                    styles.distanceText,
                    { color: colors.text.secondary },
                  ]}
                >
                  No coordinates
                </Text>
              </View>
            ) : null}

            {mall.lastVisited && (
              <Text
                style={[styles.lastVisited, { color: colors.text.secondary }]}
              >
                {new Date(mall.lastVisited).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.secondary}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'My Stores',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text.primary,
        }}
      />

      {/* Search bar */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.background }]}
      >
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search stores..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats header */}
        {filteredMalls.length > 0 && (
          <View
            style={[styles.statsHeader, { backgroundColor: colors.surface }]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {filteredMalls.length}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.text.secondary }]}
              >
                {filteredMalls.length === 1 ? 'Store' : 'Stores'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {favorites.length}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.text.secondary }]}
              >
                Favorites
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name={userLocation ? 'location' : 'location-outline'}
                size={20}
                color={userLocation ? colors.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: userLocation
                      ? colors.primary
                      : colors.text.secondary,
                  },
                ]}
              >
                {userLocation ? 'GPS Active' : locationError || 'No Location'}
              </Text>
            </View>
          </View>
        )}

        {/* Mall cards */}
        {filteredMalls.map(renderMallCard)}

        {/* Empty state */}
        {filteredMalls.length === 0 && malls.length === 0 && (
          <View style={styles.emptyState}>
            <View
              style={[styles.emptyIcon, { backgroundColor: colors.surface }]}
            >
              <Ionicons
                name="storefront-outline"
                size={48}
                color={colors.text.secondary}
              />
            </View>
            <Text
              style={[styles.emptyStateText, { color: colors.text.primary }]}
            >
              No stores saved yet
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: colors.text.secondary },
              ]}
            >
              Start by adding your favorite shopping locations to track prices
              and manage your shopping experience
            </Text>
          </View>
        )}

        {/* No search results */}
        {filteredMalls.length === 0 && malls.length > 0 && (
          <View style={styles.emptyState}>
            <View
              style={[styles.emptyIcon, { backgroundColor: colors.surface }]}
            >
              <Ionicons
                name="search-outline"
                size={48}
                color={colors.text.secondary}
              />
            </View>
            <Text
              style={[styles.emptyStateText, { color: colors.text.primary }]}
            >
              No stores found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: colors.text.secondary },
              ]}
            >
              Try searching with different keywords
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating add button */}
      <Pressable
        onPress={handleAddMall}
        style={({ pressed }) => [
          styles.addMallButton,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={24} color={colors.text.inverse} />
        <Text
          style={[styles.addMallButtonText, { color: colors.text.inverse }]}
        >
          Add Store
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    includeFontPadding: false,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for floating button
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 20,
  },
  mallCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },
  mallInfo: {
    flex: 1,
    marginBottom: 12,
  },
  mallName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  mallAddress: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastVisited: {
    fontSize: 12,
    fontWeight: '500',
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  addMallButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addMallButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
