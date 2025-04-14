import { createContext, useContext, useReducer, useEffect } from 'react';
import { listReducer } from '../list/listReducer';
import {
  initializeListData,
  createList as createListAction,
  addItem as addItemAction,
  updateItem as updateItemAction,
  removeItem as removeItemAction,
  updateList as updateListAction,
  deleteList as deleteListAction,
  addToHistory,
  loadHistory,
} from '../actions';
import { loadPersistedState, persistState } from '../../utils/persistence';

//generate initial list data

const initialState = {
  lists: [],
  purchaseHistory: [],
  error: null,
  isLoading: false,
};

export const ListContext = createContext();

export function ListProvider({ children }) {
  const [state, dispatch] = useReducer(listReducer, initialState);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const data = await loadPersistedState('LISTS');
      if (data) {
        dispatch(initializeListData(data.lists));
        dispatch(loadHistory(data.history));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      await persistState('LISTS', {
        lists: state.lists,
        history: state.purchaseHistory,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const createList = (list) => {
    dispatch(createListAction(list));
  };

  const addItem = (listId, item) => {
    dispatch(addItemAction(listId, item));
  };

  const updateItem = (listId, itemId, updates) => {
    dispatch(updateItemAction(listId, itemId, updates));
  };

  const removeItem = (listId, itemId) => {
    dispatch(removeItemAction(listId, itemId));
  };

  const updateList = (listId, updatedList) => {
    dispatch(updateListAction(listId, updatedList));
  };

  const deleteList = (listId) => {
    dispatch(deleteListAction(listId));
  };

  const addPurchaseToHistory = (
    listId,
    purchasedItems,
    totalAmount,
    storeName
  ) => {
    dispatch(
      addToHistory({
        listId,
        items: purchasedItems,
        totalAmount,
        storeName,
        purchaseDate: new Date().toISOString(),
      })
    );
  };

  return (
    <ListContext.Provider
      value={{
        state,
        createList,
        addItem,
        updateItem,
        removeItem,
        updateList,
        deleteList,
        addPurchaseToHistory,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => useContext(ListContext);
