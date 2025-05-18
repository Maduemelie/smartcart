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
import { useMall } from '../mall/MallContext';

const initialState = {
  lists: [],
  templates: [],
  purchaseHistory: [],
  customUnits: ['pcs', 'kg', 'g', 'L', 'ml', 'pack'],
  sortSettings: { by: 'dateCreated', order: 'desc' },
  filterSettings: {},
  isLoading: true,
};

export const ListContext = createContext();

export function ListProvider({ children }) {
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { dispatch: mallDispatch } = useMall() || { dispatch: null };

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const data = await loadPersistedState('LISTS');
      if (data) {
        dispatch(actions.initializeListData(data));
      }
    } catch (error) {
      console.error('Error loading list data:', error);
    }
  };

  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const saveStateToStorage = async () => {
    try {
      await persistState('LISTS', {
        lists: state.lists,
        templates: state.templates,
        purchaseHistory: state.purchaseHistory,
        customUnits: state.customUnits,
      });
    } catch (error) {
      console.error('Error saving list data:', error);
    }
  };

  const parseTextToItems = useCallback((text) => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(\d*\.?\d*)\s*([a-zA-Z]*)\s*(.+)$/);
        if (match) {
          const [_, quantity, unit, name] = match;
          return {
            name: name.trim(),
            quantity: quantity || '1',
            unit: unit || 'pcs',
          };
        }
        return { name: line, quantity: '1', unit: 'pcs' };
      });
  }, []);

  const handleBatchAdd = useCallback((listId, text) => {
    const items = parseTextToItems(text);
    dispatch(actions.batchAddItems(listId, items));
  }, []);

  const addCustomUnit = useCallback(
    (unit) => {
      if (!state.customUnits.includes(unit)) {
        dispatch(actions.addCustomUnit(unit));
      }
    },
    [state.customUnits]
  );

  const saveTemplate = useCallback((listId, name) => {
    dispatch(actions.saveAsTemplate(listId, name));
  }, []);

  const loadTemplate = useCallback((templateId) => {
    dispatch(actions.loadTemplate(templateId));
  }, []);

  const reorderItems = useCallback((listId, itemIds) => {
    dispatch(actions.reorderItems(listId, itemIds));
  }, []);

  const setSortSettings = useCallback((sortBy, sortOrder) => {
    dispatch(actions.setListSort(sortBy, sortOrder));
  }, []);

  const setFilterSettings = useCallback((filters) => {
    dispatch(actions.setListFilter(filters));
  }, []);

  // Get sorted and filtered lists
  const getProcessedLists = useCallback(() => {
    let result = [...state.lists];

    // Apply filters
    if (state.filterSettings.category) {
      result = result.filter(
        (list) => list.category === state.filterSettings.category
      );
    }

    // Apply sorting
    const { by, order } = state.sortSettings;
    result.sort((a, b) => {
      let comparison = 0;
      switch (by) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dateCreated':
          comparison = new Date(b.dateCreated) - new Date(a.dateCreated);
          break;
        case 'itemCount':
          comparison = b.items.length - a.items.length;
          break;
        default:
          comparison = 0;
      }
      return order === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [state.lists, state.filterSettings, state.sortSettings]);

  const value = {
    state,
    dispatch,
    createList: (list) => dispatch(actions.createList(list)),
    updateList: (listId, updatedList) =>
      dispatch(actions.updateList(listId, updatedList)),
    deleteList: (listId) => {
      // Find the list to check if it has an associated mall
      const listToDelete = state.lists.find((list) => list.id === listId);

      // Delete the list
      dispatch(actions.deleteList(listId));

      // If the list has an associated mall, remove the list from that mall
      if (listToDelete && listToDelete.mallId && mallDispatch) {
        mallDispatch(actions.removeListFromMall(listToDelete.mallId, listId));
      }
    },
    addItem: (listId, item) => dispatch(actions.addItem(listId, item)),
    updateItem: (listId, itemId, updates) =>
      dispatch(actions.updateItem(listId, itemId, updates)),
    removeItem: (listId, itemId) =>
      dispatch(actions.removeItem(listId, itemId)),
    addPurchaseToHistory: (purchaseData) =>
      dispatch(actions.addToHistory(purchaseData)),
    handleBatchAdd,
    addCustomUnit,
    saveTemplate,
    loadTemplate,
    reorderItems,
    setSortSettings,
    setFilterSettings,
    getProcessedLists,
    parseTextToItems,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export const useList = () => useContext(ListContext);
