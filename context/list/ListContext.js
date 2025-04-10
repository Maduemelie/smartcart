import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    // Load stored data or use initial data
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedLists, storedHistory] = await Promise.all([
        AsyncStorage.getItem('smartcart_lists'),
        AsyncStorage.getItem('smartcart_history'),
      ]);

      if (storedLists) {
        dispatch(initializeListData(JSON.parse(storedLists)));
      }
      if (storedHistory) {
        dispatch(loadHistory(JSON.parse(storedHistory)));
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
      await Promise.all([
        AsyncStorage.setItem('smartcart_lists', JSON.stringify(state.lists)),
        AsyncStorage.setItem(
          'smartcart_history',
          JSON.stringify(state.purchaseHistory)
        ),
      ]);
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
