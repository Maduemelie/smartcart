import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import QuickAccess from '../../components/QuickAccess';
import { SearchBar } from '../../components/SearchBar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useDataFetching } from '../../hooks/useDataFetching';
import { useMall } from '../../context/mall/MallContext';
import { useList } from '../../context/list/ListContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useActivity } from '../../context/activity/ActivityContext'; // Add this import
import { getRecentActivitiesForHome } from '../../context/activity/actions'; //
import { useUser } from '../../context/UserContext';

// Quick Stats Component
function QuickStatsCard({ icon, title, value, color, onPress }) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      style={[styles.statsCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statsValue, { color: colors.text.primary }]}>
        {value}
      </Text>
      <Text style={[styles.statsTitle, { color: colors.text.secondary }]}>
        {title}
      </Text>
    </Pressable>
  );
}

// Active Shopping List Card Component
function ActiveListCard({ list, onPress }) {
  const { colors } = useColorScheme();
  const completedItems =
    list.items?.filter((item) => item.purchased).length || 0;
  const totalItems = list.items?.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Pressable
      style={[styles.listCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.text.primary }]}>
          {list.name}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.text.secondary}
        />
      </View>

      <View style={styles.listProgress}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor:
                  progress === 100 ? Colors.success : Colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.text.secondary }]}>
          {completedItems}/{totalItems} items
        </Text>
      </View>

      <Text style={[styles.listDate, { color: colors.text.secondary }]}>
        Updated {new Date(list.updatedAt || Date.now()).toLocaleDateString()}
      </Text>
    </Pressable>
  );
}

// Favorite Store Card Component
function FavoriteStoreCard({ store, onPress }) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      style={[styles.storeCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View
        style={[styles.storeIcon, { backgroundColor: Colors.primary + '20' }]}
      >
        <Ionicons name="storefront" size={20} color={Colors.primary} />
      </View>
      <Text
        style={[styles.storeName, { color: colors.text.primary }]}
        numberOfLines={2}
      >
        {store.name}
      </Text>
      <Text style={[styles.storeDistance, { color: colors.text.secondary }]}>
        {store.distance || 'Near you'}
      </Text>
    </Pressable>
  );
}

// Recent Activity Item Component
function ActivityItem({ icon, title, subtitle, time, color, onPress }) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      style={[styles.activityItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: (color || Colors.primary) + '20' },
        ]}
      >
        <Ionicons name={icon} size={20} color={color || Colors.primary} />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
        <Text
          style={[styles.activitySubtitle, { color: colors.text.secondary }]}
        >
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.activityTime, { color: colors.text.secondary }]}>
        {time}
      </Text>
    </Pressable>
  );
}

export default function Home() {
  const { colors } = useColorScheme();
  const { user, isLoading } = useUser();
  const { state: mallState } = useMall();
  const { state: listState } = useList();
  const { state: activityState } = useActivity();
  const [refreshing, setRefreshing] = useState(false);
  const initialSyncComplete = useRef(false);

  // Keep the same working useDataFetching pattern
  const { loading: listsLoading } = useDataFetching(
    'recent_lists',
    async () => {
      // Fetch would happen here in a real app
      return [];
    }
  );

  useEffect(() => {
    if (!listsLoading && !initialSyncComplete.current) {
      initialSyncComplete.current = true;
    }
  }, [listsLoading]);

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Checking authentication..." />
        </View>
      </SafeAreaView>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Get current greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate stats
  const totalLists = listState.lists?.length || 0;
  const totalMalls = mallState.malls?.length || 0;
  const activeLists =
    listState.lists?.filter((list) =>
      list.items?.some((item) => !item.purchased)
    ) || [];
  const favoriteMalls =
    mallState.malls?.filter((mall) => mall.isFavorite) || [];

  // Recent activity (mock data)
  const recentActivity = getRecentActivitiesForHome(
    activityState.activities,
    5
  );
  const displayActivity =
    recentActivity.length > 0
      ? recentActivity
      : [
          {
            id: 'empty-1',
            icon: 'information-circle-outline',
            title: 'Welcome to SmartCart!',
            subtitle:
              'Start creating lists and adding stores to see your activity here',
            time: 'Now',
            color: Colors.primary,
          },
        ];
  const onRefresh = async () => {
    setRefreshing(true);
    activityState.refreshActivities?.();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (listsLoading && !initialSyncComplete.current) {
    return <LoadingSpinner message="Setting up your shopping assistant..." />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen
          options={{
            title: 'SmartCart',
            headerLargeTitle: true,
            headerSearchBarOptions: {
              placeholder: 'Search lists, items, or malls',
            },
          }}
        />

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SearchBar />

          {/* Enhanced Welcome Section */}
          <View style={styles.section}>
            <View style={styles.welcomeHeader}>
              <View>
                <Text style={[styles.greeting, { color: colors.text.primary }]}>
                  {getCurrentGreeting()}!
                </Text>
                <Text
                  style={[
                    styles.subtitleText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Ready to shop smart today?
                </Text>
              </View>
              <Pressable
                style={[
                  styles.profileButton,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => router.push('/profile')}
              >
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={colors.text.primary}
                />
              </Pressable>
            </View>
          </View>

          {/* Quick Stats Overview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Overview
            </Text>
            <View style={styles.statsContainer}>
              <QuickStatsCard
                icon="list-outline"
                title="Active Lists"
                value={activeLists.length}
                color={Colors.primary}
                onPress={() => router.push('/list')}
              />
              <QuickStatsCard
                icon="storefront-outline"
                title="Stores"
                value={totalMalls}
                color={Colors.secondary}
                onPress={() => router.push('/malls')}
              />
              <QuickStatsCard
                icon="heart-outline"
                title="Favorites"
                value={favoriteMalls.length}
                color={Colors.error.main}
                onPress={() => router.push('/malls')}
              />
            </View>
          </View>

          {/* Original QuickAccess Component */}
          <QuickAccess />

          {/* Active Shopping Lists
          {activeLists.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                ></Text>
                <Pressable onPress={() => router.push('/lists')}>
                  <Text style={[styles.seeAllText, { color: Colors.primary }]}>
                    See All
                  </Text>
                </Pressable>
              </View>
              <View style={styles.listsContainer}>
                {activeLists.slice(0, 3).map((list) => (
                  <ActiveListCard
                    key={list.id}
                    list={list}
                    onPress={() => router.push(`/lists/${list.id}`)}
                  />
                ))}
              </View>
            </View>
          )} */}

          {/* Favorite Stores */}
          {favoriteMalls.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                >
                  Favorite Stores
                </Text>
                <Pressable onPress={() => router.push('/malls')}>
                  <Text style={[styles.seeAllText, { color: Colors.primary }]}>
                    See All
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storesContainer}
              >
                {favoriteMalls.map((store) => (
                  <FavoriteStoreCard
                    key={store.id}
                    store={store}
                    onPress={() => router.push(`/mall/${store.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.primary }]}
              >
                Recent Activity
              </Text>
              {recentActivity.length > 3 && (
                <Pressable onPress={() => router.push('/activity')}>
                  <Text style={[styles.seeAllText, { color: Colors.primary }]}>
                    See All
                  </Text>
                </Pressable>
              )}
            </View>
            <View
              style={[
                styles.activityContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              {displayActivity.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  time={activity.time}
                  color={activity.color}
                  onPress={() => {
                    // You can add navigation logic here based on activity type
                    console.log('Activity pressed:', activity);
                  }}
                />
              ))}
            </View>
          </View>

          {/* Empty State for New Users */}
          {totalLists === 0 && totalMalls === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="bag-outline"
                size={64}
                color={colors.text.secondary}
              />
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                Welcome to SmartCart!
              </Text>

              <Text
                style={[styles.emptySubtitle, { color: colors.text.secondary }]}
              >
                Start by creating your first shopping list or adding a store
              </Text>
              <View style={styles.emptyActions}>
                <Pressable
                  style={[
                    styles.emptyActionButton,
                    { backgroundColor: Colors.primary },
                  ]}
                  onPress={() => router.push('/lists/new')}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={Colors.text.inverse}
                  />
                  <Text
                    style={[
                      styles.emptyActionText,
                      { color: Colors.text.inverse },
                    ]}
                  >
                    Create First List
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 8,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  listsContainer: {
    gap: 12,
  },
  listCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  listProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 60,
  },
  listDate: {
    fontSize: 12,
    fontWeight: '400',
  },
  storesContainer: {
    paddingRight: 16,
    gap: 12,
  },
  storeCard: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  storeDistance: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  activityContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyActions: {
    width: '100%',
    maxWidth: 200,
  },
  emptyActionButton: {
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
  emptyActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});