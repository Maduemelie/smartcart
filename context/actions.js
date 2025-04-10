// List Actions
export const LIST_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_LIST_DATA',
  CREATE_LIST: 'CREATE_LIST',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  DELETE_LIST: 'DELETE_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  UPDATE_HISTORY: 'UPDATE_HISTORY',
  LOAD_HISTORY: 'LOAD_HISTORY',
};

export const initializeListData = (lists) => ({
  type: LIST_ACTIONS.INITIALIZE_DATA,
  payload: lists,
});

export const createList = (list) => ({
  type: LIST_ACTIONS.CREATE_LIST,
  payload: list,
});

export const addItem = (listId, item) => ({
  type: LIST_ACTIONS.ADD_ITEM,
  payload: { listId, item },
});

export const deleteList = (listId) => ({
  type: LIST_ACTIONS.DELETE_LIST,
  payload: { listId },
});

export const updateList = (listId, updatedList) => ({
  type: LIST_ACTIONS.UPDATE_LIST,
  payload: { listId, updatedList },
});

export const updateItem = (listId, itemId, item) => ({
  type: LIST_ACTIONS.UPDATE_ITEM,
  payload: { listId, itemId, item },
});

export const removeItem = (listId, itemId) => ({
  type: LIST_ACTIONS.REMOVE_ITEM,
  payload: { listId, itemId },
});

export const addToHistory = (purchaseData) => ({
  type: LIST_ACTIONS.ADD_TO_HISTORY,
  payload: purchaseData,
});

export const loadHistory = (history) => ({
  type: LIST_ACTIONS.LOAD_HISTORY,
  payload: history,
});

// Mall Actions
export const MALL_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_MALL_DATA',
  ADD_MALL: 'ADD_MALL',
  UPDATE_MALL: 'UPDATE_MALL',
  DELETE_MALL: 'DELETE_MALL',
  ADD_PRICE_RECORD: 'ADD_PRICE_RECORD',
  SET_FAVORITE: 'SET_FAVORITE',
  UPDATE_MALL_STATS: 'UPDATE_MALL_STATS',
};

export const initializeMallData = (malls) => ({
  type: MALL_ACTIONS.INITIALIZE_DATA,
  payload: malls,
});

export const addMall = (mall) => ({
  type: MALL_ACTIONS.ADD_MALL,
  payload: mall,
});

export const updateMall = (mallId, mall) => ({
  type: MALL_ACTIONS.UPDATE_MALL,
  payload: { mallId, mall },
});

export const deleteMall = (mallId) => ({
  type: MALL_ACTIONS.DELETE_MALL,
  payload: mallId,
});

export const addPriceRecord = (mallId, itemId, price) => ({
  type: MALL_ACTIONS.ADD_PRICE_RECORD,
  payload: { mallId, itemId, price },
});

export const setMallFavorite = (mallId, isFavorite) => ({
  type: MALL_ACTIONS.SET_FAVORITE,
  payload: { mallId, isFavorite },
});

// Price Actions
export const PRICE_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_PRICE_DATA',
  UPDATE_PRICE: 'UPDATE_PRICE',
};

export const initializePriceData = (prices) => ({
  type: PRICE_ACTIONS.INITIALIZE_DATA,
  payload: prices,
});

export const updatePrice = (price) => ({
  type: PRICE_ACTIONS.UPDATE_PRICE,
  payload: price,
});
