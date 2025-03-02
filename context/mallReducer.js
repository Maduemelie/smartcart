import { MALL_ACTIONS } from './actions';

export function mallReducer(state, action) {
  switch (action.type) {
    case MALL_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        list: action.payload,
      };

    case MALL_ACTIONS.ADD_MALL:
      return {
        ...state,
        list: [...state.list, action.payload],
      };

    case MALL_ACTIONS.UPDATE_MALL:
      return {
        ...state,
        list: state.list.map((mall) =>
          mall.id === action.payload.mallId
            ? { ...mall, ...action.payload.mall }
            : mall
        ),
      };

    case MALL_ACTIONS.DELETE_MALL:
      return {
        ...state,
        list: state.list.filter((mall) => mall.id !== action.payload.mallId),
      };

    default:
      console.error(`Unhandled action type: ${action.type}`);
      return state;
  }
}
