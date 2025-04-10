import { MALL_ACTIONS } from '../actions';

export function mallReducer(state, action) {
  switch (action.type) {
    case MALL_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        malls: action.payload.malls || [],
        priceHistory: action.payload.priceHistory || [],
      };

    case MALL_ACTIONS.ADD_MALL:
      return {
        ...state,
        malls: [
          ...state.malls,
          {
            id: Date.now().toString(),
            ...action.payload,
            createdAt: new Date().toISOString(),
          },
        ],
      };

    case MALL_ACTIONS.UPDATE_MALL:
      return {
        ...state,
        malls: state.malls.map((mall) =>
          mall.id === action.payload.mallId
            ? { ...mall, ...action.payload.updates }
            : mall
        ),
      };

    case MALL_ACTIONS.ADD_PRICE_RECORD:
      return {
        ...state,
        priceHistory: [
          ...state.priceHistory,
          {
            id: Date.now().toString(),
            mallId: action.payload.mallId,
            itemId: action.payload.itemId,
            price: action.payload.price,
            date: new Date().toISOString(),
          },
        ],
        lastVisited: action.payload.mallId,
      };

    case MALL_ACTIONS.SET_FAVORITE:
      return {
        ...state,
        favorites: action.payload.isFavorite
          ? [...state.favorites, action.payload.mallId]
          : state.favorites.filter((id) => id !== action.payload.mallId),
      };

    default:
      return state;
  }
}
