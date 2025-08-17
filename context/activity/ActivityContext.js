import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityReducer, initialState } from './reducer';
import {
  addActivity as createAddActivityAction,
  loadActivities as createLoadActivitiesAction,
  clearActivities as createClearActivitiesAction,
  setLoading as createSetLoadingAction,
  setError as createSetErrorAction,
} from './actions';

const ActivityContext = createContext();

const STORAGE_KEY = '@smartcart/activities';

export function ActivityProvider({ children }) {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  // Load activities from storage on mount
  useEffect(() => {
    loadActivitiesFromStorage();
  }, []);

  // Save activities to storage whenever they change
  useEffect(() => {
    if (state.activities.length > 0) {
      saveActivitiesToStorage();
    }
  }, [state.activities]);

  const loadActivitiesFromStorage = async () => {
    try {
      dispatch(createSetLoadingAction(true));
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const activities = JSON.parse(stored);
        dispatch(createLoadActivitiesAction(activities));
      } else {
        dispatch(createLoadActivitiesAction([]));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      dispatch(createSetErrorAction('Failed to load activities'));
      dispatch(createLoadActivitiesAction([]));
    }
  };

  const saveActivitiesToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.activities));
    } catch (error) {
      console.error('Error saving activities:', error);
      dispatch(createSetErrorAction('Failed to save activities'));
    }
  };

  const addActivity = (type, data) => {
    try {
      dispatch(createAddActivityAction(type, data));
    } catch (error) {
      console.error('Error adding activity:', error);
      dispatch(createSetErrorAction('Failed to add activity'));
    }
  };

  const clearActivities = async () => {
    try {
      dispatch(createClearActivitiesAction());
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing activities:', error);
      dispatch(createSetErrorAction('Failed to clear activities'));
    }
  };

  const refreshActivities = () => {
    loadActivitiesFromStorage();
  };

  // Get activities by date range
  const getActivitiesByDateRange = (startDate, endDate) => {
    return state.activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate && activityDate <= endDate;
    });
  };

  // Get activities count by type
  const getActivityCountByType = (type) => {
    return state.activities.filter((activity) => activity.type === type).length;
  };

  // Get most recent activity
  const getMostRecentActivity = () => {
    return state.activities.length > 0 ? state.activities[0] : null;
  };

  const value = {
    state,
    addActivity,
    clearActivities,
    refreshActivities,
    getActivitiesByDateRange,
    getActivityCountByType,
    getMostRecentActivity,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
