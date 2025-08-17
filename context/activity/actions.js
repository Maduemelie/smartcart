// Activity Types
import { formatDistanceToNow } from 'date-fns';
export const ACTIVITY_TYPES = {
  LIST_CREATED: 'LIST_CREATED',
  LIST_UPDATED: 'LIST_UPDATED',
  LIST_DELETED: 'LIST_DELETED',
  ITEM_ADDED: 'ITEM_ADDED',
  ITEM_PURCHASED: 'ITEM_PURCHASED',
  MALL_VISITED: 'MALL_VISITED',
  MALL_ADDED: 'MALL_ADDED',
  PRICE_ALERT: 'PRICE_ALERT',
  COMPARISON_MADE: 'COMPARISON_MADE',
};

// Activity Actions
export const ACTIVITY_ACTIONS = {
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  LOAD_ACTIVITIES: 'LOAD_ACTIVITIES',
  CLEAR_ACTIVITIES: 'CLEAR_ACTIVITIES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Action Creators
export const addActivity = (type, data) => ({
  type: ACTIVITY_ACTIONS.ADD_ACTIVITY,
  payload: {
    type,
    ...data,
  },
});

export const loadActivities = (activities) => ({
  type: ACTIVITY_ACTIONS.LOAD_ACTIVITIES,
  payload: activities,
});

export const clearActivities = () => ({
  type: ACTIVITY_ACTIONS.CLEAR_ACTIVITIES,
});

export const setLoading = (loading) => ({
  type: ACTIVITY_ACTIONS.SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: ACTIVITY_ACTIONS.SET_ERROR,
  payload: error,
});

// Helper function to format activity data for display
export const formatActivityForDisplay = (activity) => {
  const timeAgo = getTimeAgo(new Date(activity.timestamp));

  switch (activity.type) {
    case ACTIVITY_TYPES.LIST_CREATED:
      return {
        id: activity.id,
        icon: 'list-outline',
        title: `Created "${activity.listName}"`,
        subtitle: `Added ${activity.itemCount || 0} items`,
        time: timeAgo,
        color: '#4CAF50',
      };

    case ACTIVITY_TYPES.LIST_UPDATED:
      return {
        id: activity.id,
        icon: 'create-outline',
        title: `Updated "${activity.listName}"`,
        subtitle: activity.changes || 'Modified list',
        time: timeAgo,
        color: '#2196F3',
      };

    case ACTIVITY_TYPES.LIST_DELETED:
      return {
        id: activity.id,
        icon: 'trash-outline',
        title: `Deleted "${activity.listName}"`,
        subtitle: `Removed ${activity.itemCount || 0} items`,
        time: timeAgo,
        color: '#F44336',
      };

    case ACTIVITY_TYPES.ITEM_ADDED:
      return {
        id: activity.id,
        icon: 'add-outline',
        title: `Added ${activity.itemName}`,
        subtitle: `To "${activity.listName}"`,
        time: timeAgo,
        color: '#4CAF50',
      };

    case ACTIVITY_TYPES.ITEM_PURCHASED:
      return {
        id: activity.id,
        icon: 'checkmark-circle-outline',
        title: `Purchased ${activity.itemName}`,
        subtitle: `At ${activity.mallName}${
          activity.price ? ` •  ₦${activity.price}` : ''
        }`,
        time: timeAgo,
        color: '#4CAF50',
      };

    case ACTIVITY_TYPES.MALL_VISITED:
      return {
        id: activity.id,
        icon: 'storefront-outline',
        title: `Visited ${activity.mallName}`,
        subtitle: `Purchased ${activity.itemCount || 0} items${
          activity.totalAmount ? ` •  ₦${activity.totalAmount}` : ''
        }`,
        time: timeAgo,
        color: '#FF9800',
      };

    case ACTIVITY_TYPES.MALL_ADDED:
      return {
        id: activity.id,
        icon: 'add-circle-outline',
        title: `Added ${activity.mallName}`,
        subtitle: activity.mallAddress || 'New store added',
        time: timeAgo,
        color: '#9C27B0',
      };

    case ACTIVITY_TYPES.PRICE_ALERT:
      return {
        id: activity.id,
        icon: 'trending-down-outline',
        title: 'Price Alert',
        subtitle: `${activity.itemName} price ${
          activity.direction === 'down' ? 'dropped' : 'increased'
        } at ${activity.mallName}`,
        time: timeAgo,
        color: activity.direction === 'down' ? '#4CAF50' : '#F44336',
      };

    case ACTIVITY_TYPES.COMPARISON_MADE:
      return {
        id: activity.id,
        icon: 'analytics-outline',
        title: 'Price Comparison',
        subtitle: `Compared ${activity.itemName} across ${activity.storeCount} stores`,
        time: timeAgo,
        color: '#607D8B',
      };

    default:
      return {
        id: activity.id,
        icon: 'information-circle-outline',
        title: 'Activity',
        subtitle: 'Unknown activity',
        time: timeAgo,
        color: '#757575',
      };
  }
};

// Helper function to calculate time ago
export const getTimeAgo = (timestamp) =>
  formatDistanceToNow(timestamp, { addSuffix: true });

// Helper function to get recent activities for home screen
export const getRecentActivitiesForHome = (activities, limit = 5) => {
  return activities.slice(0, limit).map(formatActivityForDisplay);
};

// Helper function to filter activities by type
export const getActivitiesByType = (activities, type) => {
  return activities.filter((activity) => activity.type === type);
};

// Helper function to get activities from today
export const getTodayActivities = (activities) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return activities.filter((activity) => {
    const activityDate = new Date(activity.timestamp);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === today.getTime();
  });
};

// Helper function to get activities from this week
export const getWeekActivities = (activities) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return activities.filter((activity) => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= weekAgo;
  });
};
