import { LIST_ACTIONS } from '../actions';

export function listReducer(state, action) {
  switch (action.type) {
    case LIST_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        lists: action.payload || [], // Ensure we always have an array
        isLoading: false,
      };

    case LIST_ACTIONS.CREATE_LIST:
      const newList = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        dateCreated: action.payload.dateCreated || new Date().toISOString(),
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
      };

      return {
        ...state,
        lists: Array.isArray(state.lists)
          ? [...state.lists, newList]
          : [newList],
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

    case LIST_ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        purchaseHistory: [
          ...state.purchaseHistory,
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...action.payload,
          },
        ],
      };

    case LIST_ACTIONS.LOAD_HISTORY:
      return {
        ...state,
        purchaseHistory: action.payload,
      };

    case LIST_ACTIONS.SAVE_AS_TEMPLATE:
      const templateList = state.lists.find(
        (list) => list.id === action.payload.listId
      );
      if (!templateList) return state;

      return {
        ...state,
        templates: [
          ...(state.templates || []),
          {
            id: Date.now().toString(),
            name: action.payload.templateName,
            items: templateList.items,
            dateCreated: new Date().toISOString(),
          },
        ],
      };

    case LIST_ACTIONS.LOAD_TEMPLATE:
      const template = state.templates?.find((t) => t.id === action.payload);
      if (!template) return state;

      return {
        ...state,
        lists: [
          ...state.lists,
          {
            ...template,
            id: Date.now().toString(),
            dateCreated: new Date().toISOString(),
            isFromTemplate: true,
            templateId: template.id,
          },
        ],
      };

    case LIST_ACTIONS.DELETE_TEMPLATE:
      return {
        ...state,
        templates:
          state.templates?.filter((t) => t.id !== action.payload) || [],
      };

    case LIST_ACTIONS.REORDER_ITEMS:
      return {
        ...state,
        lists: state.lists.map((list) => {
          if (list.id !== action.payload.listId) return list;

          const reorderedItems = action.payload.itemIds
            .map((itemId) => list.items.find((item) => item.id === itemId))
            .filter(Boolean);

          return {
            ...list,
            items: reorderedItems,
          };
        }),
      };

    case LIST_ACTIONS.BATCH_ADD_ITEMS:
      return {
        ...state,
        lists: state.lists.map((list) => {
          if (list.id !== action.payload.listId) return list;

          const newItems = action.payload.items.map((item) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: item.name,
            quantity: item.quantity || '1',
            unit: item.unit || 'pcs',
            purchased: false,
            dateAdded: new Date().toISOString(),
          }));

          return {
            ...list,
            items: [...list.items, ...newItems],
          };
        }),
      };

    case LIST_ACTIONS.ADD_CUSTOM_UNIT:
      return {
        ...state,
        customUnits: [...(state.customUnits || []), action.payload],
      };

    case LIST_ACTIONS.SET_LIST_SORT:
      return {
        ...state,
        sortSettings: {
          by: action.payload.sortBy,
          order: action.payload.sortOrder,
        },
      };

    case LIST_ACTIONS.SET_LIST_FILTER:
      return {
        ...state,
        filterSettings: action.payload,
      };

    default:
      return state;
  }
}
