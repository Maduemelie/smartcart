import 'react-native-get-random-values';
import { ACTIVITY_ACTIONS } from './actions';
import { v4 as uuidv4 } from 'uuid';

export const initialState = {
  activities: [],
  loading: false,
  error: null,
};

export function activityReducer(state, action) {
  switch (action.type) {
    case ACTIVITY_ACTIONS.ADD_ACTIVITY:
      const newActivity = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };

      const updatedActivities = [newActivity, ...state.activities]
        .slice(0, 50) // Keep only last 50 activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        ...state,
        activities: updatedActivities,
        error: null,
      };

    case ACTIVITY_ACTIONS.LOAD_ACTIVITIES:
      return {
        ...state,
        activities: action.payload || [],
        loading: false,
        error: null,
      };

    case ACTIVITY_ACTIONS.CLEAR_ACTIVITIES:
      return {
        ...state,
        activities: [],
        error: null,
      };

    case ACTIVITY_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTIVITY_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
