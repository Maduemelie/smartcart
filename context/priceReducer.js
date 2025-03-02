import { PRICE_ACTIONS } from './actions';

export function priceReducer(state, action) {
  switch (action.type) {
    case PRICE_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        priceHistory: action.payload,
      };

    case PRICE_ACTIONS.UPDATE_PRICE:
      return {
        ...state,
        priceHistory: [...state.priceHistory, action.payload],
        lastUpdate: new Date(),
      };

    default:
      console.error(`Unhandled action type: ${action.type}`);
      return state;
  }
}
