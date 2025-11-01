import { LIST_ACTIONS } from '../actions';

export function listReducer(state, action) {
  switch (action.type) {
    case LIST_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        lists: action.payload?.lists || [],
        purchaseHistory: action.payload?.purchaseHistory || [],
        isLoading: false,
      };

    case LIST_ACTIONS.CREATE_LIST:
      const newList = {
        id: action.payload.id || `list-${Date.now()}`,
        name: action.payload.name,
        items: [],
        purchasedItems: [],
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        ...action.payload,
      };

      return {
        ...state,
        lists: [...state.lists, newList],
      };

    case LIST_ACTIONS.UPDATE_LIST:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                ...action.payload.updatedList,
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
      };

    case LIST_ACTIONS.DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload.listId),
      };

    case LIST_ACTIONS.ADD_ITEM:
      const newItem = {
        id: action.payload.item.id || `item-${Date.now()}`,
        name: action.payload.item.name,
        quantity: action.payload.item.quantity || 1,
        unit: action.payload.item.unit || 'pcs',
        dateAdded: new Date().toISOString(),
        ...action.payload.item,
      };

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: [...list.items, newItem],
                lastUpdated: new Date().toISOString(),
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
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
      };

    case LIST_ACTIONS.MOVE_ITEM_TO_PURCHASED:
      const { listId, itemId, storeId, price } = action.payload;
      const list = state.lists.find((l) => l.id === listId);
      if (!list) return state;

      const item = list.items.find((i) => i.id === itemId);
      if (!item) return state;

      const updatedItems = list.items.filter((i) => i.id !== itemId);
      const purchasedItem = {
        ...item,
        storeId,
        price,
        datePurchased: new Date().toISOString(),
        listId,
      };

      const historyItem = {
        ...item, // Start with the original item's properties (name, quantity, unit)
        price, // Add the price
        storeId, // Add the storeId
        listId, // Add the listId
        datePurchased: purchasedItem.datePurchased, // Use the same timestamp
        itemId: item.id, // Keep the original item's ID for reference
        id: `hist-${item.id}-${new Date().getTime()}`, // This is a unique ID for the history entry itself
      };

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: updatedItems,
                purchasedItems: [...(list.purchasedItems || []), purchasedItem],
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
        purchaseHistory: [...state.purchaseHistory, historyItem],
      };

    case LIST_ACTIONS.UPDATE_PURCHASED_ITEM_PRICE:
      const { listId: plid, itemId: piid, price: newPrice } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === plid
            ? {
                ...list,
                purchasedItems: (list.purchasedItems || []).map((item) =>
                  item.id === piid ? { ...item, price: newPrice } : item
                ),
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
      };

    case LIST_ACTIONS.UPDATE_PURCHASED_ITEM_STORE:
      const {
        listId: slid,
        itemId: siid,
        storeId: newStoreId,
      } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === slid
            ? {
                ...list,
                purchasedItems: (list.purchasedItems || []).map((item) =>
                  item.id === siid ? { ...item, storeId: newStoreId } : item
                ),
                lastUpdated: new Date().toISOString(),
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
                purchasedItems: (list.purchasedItems || []).filter(
                  (item) => item.id !== action.payload.itemId
                ),
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
      };
    case LIST_ACTIONS.MOVE_ITEM_TO_SHOPPING_LIST: {
      const { listId: targetListId, itemId: targetItemId } = action.payload;

      const targetList = state.lists.find((l) => l.id === targetListId);
      if (!targetList) return state;

      const moveItem = targetList.purchasedItems.find(
        (item) => item.id === targetItemId
      );
      if (!moveItem) return state;

      const updatedPurchasedItems = targetList.purchasedItems.filter(
        (item) => item.id !== targetItemId
      );

      const updatedShoppingItems = [
        {
          ...moveItem,
          storeId: null,
          price: null,
          dateAdded: new Date().toISOString(),
        },
        ...targetList.items,
      ];

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === targetListId
            ? {
                ...list,
                items: updatedShoppingItems,
                purchasedItems: updatedPurchasedItems,
                lastUpdated: new Date().toISOString(),
              }
            : list
        ),
      };
    }

    default:
      return state;
  }
}
