import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listReducer } from '../list/listReducer';
import { initializeListData, LIST_ACTIONS } from '../actions';

//generate initial list data

const initialState = {
  lists: [],
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
      const storedLists = await AsyncStorage.getItem('smartcart_lists');
      if (storedLists) {
        dispatch(initializeListData(JSON.parse(storedLists)));
      }
      // If no stored data, keep using initial data
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      // Check if state.lists exists and is an array before saving
      if (state?.lists && Array.isArray(state.lists)) {
        await AsyncStorage.setItem(
          'smartcart_lists',
          JSON.stringify(state.lists)
        );
      } else {
        console.warn('Invalid lists data structure:', state?.lists);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const createList = (list) => {
    dispatch({
      type: LIST_ACTIONS.CREATE_LIST,
      payload: list,
    });
  };

  const addItem = (listId, item) => {
    dispatch({
      type: LIST_ACTIONS.ADD_ITEM,
      payload: { listId, item },
    });
  };

  const updateItem = (listId, itemId, updates) => {
    dispatch({
      type: LIST_ACTIONS.UPDATE_ITEM,
      payload: { listId, itemId, updates },
    });
  };

  const removeItem = (listId, itemId) => {
    dispatch({
      type: LIST_ACTIONS.REMOVE_ITEM,
      payload: { listId, itemId },
    });
  };

  const updateList = (listId, updatedList) => {
    dispatch({
      type: LIST_ACTIONS.UPDATE_LIST,
      payload: { listId, updatedList },
    });
  };

  const deleteList = (listId) => {
    dispatch({
      type: LIST_ACTIONS.DELETE_LIST,
      payload: { listId },
    });
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
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => useContext(ListContext);
