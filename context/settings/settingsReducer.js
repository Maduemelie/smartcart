import { SETTINGS_ACTIONS } from '../actions';

export function settingsReducer(state, action) {
  switch (action.type) {
    case SETTINGS_ACTIONS.INITIALIZE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };

    case SETTINGS_ACTIONS.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...action.payload,
        },
      };

    case SETTINGS_ACTIONS.UPDATE_LOCATION_SETTINGS:
      return {
        ...state,
        location: {
          ...state.location,
          ...action.payload,
        },
      };

    case SETTINGS_ACTIONS.UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    case SETTINGS_ACTIONS.UPDATE_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case SETTINGS_ACTIONS.UPDATE_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case SETTINGS_ACTIONS.UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}
