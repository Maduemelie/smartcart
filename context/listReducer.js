import { LIST_ACTIONS } from './actions';

export function listReducer(state, action) {
  switch (action.type) {
    case LIST_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        lists: action.payload || [], // Ensure we always have an array
        isLoading: false,
      };

    case LIST_ACTIONS.CREATE_LIST:
      return {
        ...state,
        lists: [
          ...state.lists,
          {
            id: Date.now().toString(),
            dateCreated: new Date(),
            items: [],
            ...action.payload,
          },
        ],
      };

    case LIST_ACTIONS.UPDATE_LIST:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? { ...list, ...action.payload.updatedList }
            : list
        ),
      };

    case LIST_ACTIONS.DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload.listId),
      };

    case LIST_ACTIONS.ADD_ITEM:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: [
                  ...list.items,
                  {
                    id: Date.now().toString(),
                    ...action.payload.item,
                  },
                ],
              }
            : list
        ),
      };

    case LIST_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === action.payload.itemId
                    ? { ...item, ...action.payload.updates }
                    : item
                ),
              }
            : list
        ),
      };

    case LIST_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(
                  (item) => item.id !== action.payload.itemId
                ),
              }
            : list
        ),
      };

    default:
      return state;
  }
}
