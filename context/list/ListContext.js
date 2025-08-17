import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import { listReducer } from './listReducer';
import { loadPersistedState, persistState } from '../../utils/persistence';
import * as actions from '../actions';
import { useActivity } from '../activity/ActivityContext';
import { ACTIVITY_TYPES } from '../activity/actions';

const initialState = {
  lists: [],
  purchaseHistory: [],
  isLoading: true,
};

export const ListContext = createContext();

export function ListProvider({ children }) {
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { addActivity } = useActivity(); // Add this line

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const data = await loadPersistedState('LISTS');
      if (data) {
        dispatch(actions.initializeListData(data));
      } else {
        dispatch(actions.initializeListData({ lists: [] }));
      }
    } catch (error) {
      console.error('Error loading list data:', error);
      dispatch(actions.initializeListData({ lists: [] }));
    }
  };

  useEffect(() => {
    if (!state.isLoading) {
      saveStateToStorage();
    }
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      await persistState('LISTS', {
        lists: state.lists,
        purchaseHistory: state.purchaseHistory,
      });
    } catch (error) {
      console.error('Error saving list data:', error);
    }
  };

  // List CRUD operations with activity tracking
  const createList = useCallback(
    (listData) => {
      dispatch(actions.createList(listData));

      // Add activity tracking
      addActivity(ACTIVITY_TYPES.LIST_CREATED, {
        listName: listData.name,
        itemCount: listData.items?.length || 0,
      });
    },
    [addActivity]
  );

  const updateList = useCallback(
    (listId, updatedData) => {
      const list = getListById(listId);
      dispatch(actions.updateList(listId, updatedData));

      // Add activity tracking
      if (list) {
        addActivity(ACTIVITY_TYPES.LIST_UPDATED, {
          listName: updatedData.name || list.name,
          changes: 'List details updated',
        });
      }
    },
    [addActivity]
  );

  const deleteList = useCallback(
    (listId) => {
      const list = getListById(listId);
      dispatch(actions.deleteList(listId));

      // Add activity tracking
      if (list) {
        addActivity(ACTIVITY_TYPES.LIST_DELETED, {
          listName: list.name,
          itemCount: list.items?.length || 0,
        });
      }
    },
    [addActivity]
  );

  // Item CRUD operations with activity tracking
  const addItem = useCallback(
    (listId, itemData) => {
      const list = getListById(listId);
      dispatch(actions.addItem(listId, itemData));

      // Add activity tracking
      if (list) {
        addActivity(ACTIVITY_TYPES.ITEM_ADDED, {
          itemName: itemData.name,
          listName: list.name,
        });
      }
    },
    [addActivity]
  );

  const updateItem = useCallback((listId, itemId, updates) => {
    dispatch(actions.updateItem(listId, itemId, updates));
  }, []);

  const removeItem = useCallback((listId, itemId) => {
    dispatch(actions.removeItem(listId, itemId));
  }, []);

  // Purchase tracking operations with activity tracking
  const moveItemToPurchased = useCallback(
    (listId, itemId, storeId, price, storeName) => {
      const list = getListById(listId);
      const item = list?.items.find((i) => i.id === itemId);

      dispatch(actions.moveItemToPurchased(listId, itemId, storeId, price));

      // Add activity tracking
      if (item && list) {
        addActivity(ACTIVITY_TYPES.ITEM_PURCHASED, {
          itemName: item.name,
          listName: list.name,
          mallName: storeName || 'Store',
          price: price,
        });
      }
    },
    [addActivity]
  );

  const updatePurchasedItemPrice = useCallback((listId, itemId, price) => {
    dispatch(actions.updatePurchasedItemPrice(listId, itemId, price));
  }, []);

  const updatePurchasedItemStore = useCallback((listId, itemId, storeId) => {
    dispatch(actions.updatePurchasedItemStore(listId, itemId, storeId));
  }, []);

  const moveItemToShoppingList = useCallback((listId, itemId) => {
    dispatch(actions.moveItemToShoppingList(listId, itemId));
  }, []);

  // Helper functions - pure selectors (no changes needed)
  const getListById = useCallback(
    (listId) => {
      return state.lists.find((list) => list.id === listId);
    },
    [state.lists]
  );

  const getListItems = useCallback(
    (listId) => {
      const list = getListById(listId);
      return list ? list.items : [];
    },
    [getListById]
  );

  const getPurchasedItems = useCallback(
    (listId) => {
      const list = getListById(listId);
      return list ? list.purchasedItems || [] : [];
    },
    [getListById]
  );

  const getListStats = useCallback(
    (listId) => {
      const list = getListById(listId);
      if (!list) return { totalItems: 0, purchasedItems: 0, remainingItems: 0 };

      const totalItems = list.items.length + (list.purchasedItems?.length || 0);
      const purchasedItems = list.purchasedItems?.length || 0;
      const remainingItems = list.items.length;

      return { totalItems, purchasedItems, remainingItems };
    },
    [getListById]
  );

  const value = {
    // State
    state,
    lists: state.lists,
    isLoading: state.isLoading,

    // List operations
    createList,
    updateList,
    deleteList,

    // Item operations
    addItem,
    updateItem,
    removeItem,
    moveItemToShoppingList,

    // Purchase tracking
    moveItemToPurchased,
    updatePurchasedItemPrice,
    updatePurchasedItemStore,

    // Helper functions
    getListById,
    getListItems,
    getPurchasedItems,
    getListStats,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};
