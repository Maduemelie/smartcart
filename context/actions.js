// List Actions
export const LIST_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_LIST_DATA',
  CREATE_LIST: 'CREATE_LIST',
  DELETE_LIST: 'DELETE_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  LOAD_HISTORY: 'LOAD_HISTORY',
  SAVE_AS_TEMPLATE: 'SAVE_AS_TEMPLATE',
  LOAD_TEMPLATE: 'LOAD_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  REORDER_ITEMS: 'REORDER_ITEMS',
  BATCH_ADD_ITEMS: 'BATCH_ADD_ITEMS',
  ADD_CUSTOM_UNIT: 'ADD_CUSTOM_UNIT',
  SET_LIST_SORT: 'SET_LIST_SORT',
  SET_LIST_FILTER: 'SET_LIST_FILTER',
};

// Mall Actions
export const MALL_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_MALL_DATA',
  ADD_MALL: 'ADD_MALL',
  UPDATE_MALL: 'UPDATE_MALL',
  DELETE_MALL: 'DELETE_MALL',
  ADD_PRICE_RECORD: 'ADD_PRICE_RECORD',
  SET_FAVORITE: 'SET_FAVORITE',
  UPDATE_MALL_STATS: 'UPDATE_MALL_STATS',
  UPDATE_LAST_VISITED: 'UPDATE_LAST_VISITED',
  ADD_LIST_TO_MALL: 'ADD_LIST_TO_MALL',
  REMOVE_LIST_FROM_MALL: 'REMOVE_LIST_FROM_MALL',
};

// List Action Creators
export const initializeListData = (data) => ({
  type: LIST_ACTIONS.INITIALIZE_DATA,
  payload: data,
});

export const createList = (list) => ({
  type: LIST_ACTIONS.CREATE_LIST,
  payload: list,
});

export const updateList = (listId, updatedList) => ({
  type: LIST_ACTIONS.UPDATE_LIST,
  payload: { listId, updatedList },
});

export const deleteList = (listId) => ({
  type: LIST_ACTIONS.DELETE_LIST,
  payload: { listId },
});

export const addItem = (listId, item) => ({
  type: LIST_ACTIONS.ADD_ITEM,
  payload: { listId, item },
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

export const saveAsTemplate = (listId, templateName) => ({
  type: LIST_ACTIONS.SAVE_AS_TEMPLATE,
  payload: { listId, templateName },
});

export const loadTemplate = (templateId) => ({
  type: LIST_ACTIONS.LOAD_TEMPLATE,
  payload: templateId,
});

export const deleteTemplate = (templateId) => ({
  type: LIST_ACTIONS.DELETE_TEMPLATE,
  payload: templateId,
});

export const reorderItems = (listId, itemIds) => ({
  type: LIST_ACTIONS.REORDER_ITEMS,
  payload: { listId, itemIds },
});

export const batchAddItems = (listId, items) => ({
  type: LIST_ACTIONS.BATCH_ADD_ITEMS,
  payload: { listId, items },
});

export const addCustomUnit = (unit) => ({
  type: LIST_ACTIONS.ADD_CUSTOM_UNIT,
  payload: unit,
});

export const setListSort = (sortBy, sortOrder) => ({
  type: LIST_ACTIONS.SET_LIST_SORT,
  payload: { sortBy, sortOrder },
});

export const setListFilter = (filters) => ({
  type: LIST_ACTIONS.SET_LIST_FILTER,
  payload: filters,
});

// Mall Action Creators
export const initializeMallData = (data) => ({
  type: MALL_ACTIONS.INITIALIZE_DATA,
  payload: data,
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

export const addPriceRecord = (mallId, itemId, itemName, price) => ({
  type: MALL_ACTIONS.ADD_PRICE_RECORD,
  payload: { mallId, itemId, itemName, price },
});

export const setMallFavorite = (mallId, isFavorite) => ({
  type: MALL_ACTIONS.SET_FAVORITE,
  payload: { mallId, isFavorite },
});

export const updateMallStats = (mallId) => ({
  type: MALL_ACTIONS.UPDATE_MALL_STATS,
  payload: { mallId },
});

export const updateLastVisited = (mallId) => ({
  type: MALL_ACTIONS.UPDATE_LAST_VISITED,
  payload: { mallId },
});

export const addListToMall = (mallId, listId) => ({
  type: MALL_ACTIONS.ADD_LIST_TO_MALL,
  payload: { mallId, listId },
});

export const removeListFromMall = (mallId, listId) => ({
  type: MALL_ACTIONS.REMOVE_LIST_FROM_MALL,
  payload: { mallId, listId },
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

// Settings Actions
export const SETTINGS_ACTIONS = {
  INITIALIZE_SETTINGS: 'INITIALIZE_SETTINGS',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  UPDATE_LOCATION_SETTINGS: 'UPDATE_LOCATION_SETTINGS',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  UPDATE_CURRENCY: 'UPDATE_CURRENCY',
  UPDATE_THEME: 'UPDATE_THEME',
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
};

export const initializeSettings = (settings) => ({
  type: SETTINGS_ACTIONS.INITIALIZE_SETTINGS,
  payload: settings,
});

export const updateNotifications = (settings) => ({
  type: SETTINGS_ACTIONS.UPDATE_NOTIFICATIONS,
  payload: settings,
});

export const updateLocationSettings = (settings) => ({
  type: SETTINGS_ACTIONS.UPDATE_LOCATION_SETTINGS,
  payload: settings,
});

export const updateLanguage = (language) => ({
  type: SETTINGS_ACTIONS.UPDATE_LANGUAGE,
  payload: language,
});

export const updateCurrency = (currency) => ({
  type: SETTINGS_ACTIONS.UPDATE_CURRENCY,
  payload: currency,
});

export const updateTheme = (theme) => ({
  type: SETTINGS_ACTIONS.UPDATE_THEME,
  payload: theme,
});

export const updateUserProfile = (profile) => ({
  type: SETTINGS_ACTIONS.UPDATE_USER_PROFILE,
  payload: profile,
});
