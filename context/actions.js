// List Actions
export const LIST_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_LIST_DATA',
  CREATE_LIST: 'CREATE_LIST',
  DELETE_LIST: 'DELETE_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  MOVE_ITEM_TO_PURCHASED: 'MOVE_ITEM_TO_PURCHASED',
  UPDATE_PURCHASED_ITEM_PRICE: 'UPDATE_PURCHASED_ITEM_PRICE',
  UPDATE_PURCHASED_ITEM_STORE: 'UPDATE_PURCHASED_ITEM_STORE',
  MOVE_ITEM_TO_SHOPPING_LIST: 'MOVE_ITEM_TO_SHOPPING_LIST',
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

export const updateItem = (listId, itemId, updates) => ({
  type: LIST_ACTIONS.UPDATE_ITEM,
  payload: { listId, itemId, updates },
});

export const removeItem = (listId, itemId) => ({
  type: LIST_ACTIONS.REMOVE_ITEM,
  payload: { listId, itemId },
});

// Purchase tracking action creators (ADDED)
export const moveItemToPurchased = (listId, itemId, storeId, price) => ({
  type: LIST_ACTIONS.MOVE_ITEM_TO_PURCHASED,
  payload: { listId, itemId, storeId, price },
});

export const updatePurchasedItemPrice = (listId, itemId, price) => ({
  type: LIST_ACTIONS.UPDATE_PURCHASED_ITEM_PRICE,
  payload: { listId, itemId, price },
});

export const updatePurchasedItemStore = (listId, itemId, storeId) => ({
  type: LIST_ACTIONS.UPDATE_PURCHASED_ITEM_STORE,
  payload: { listId, itemId, storeId },
});
export const moveItemToShoppingList = (listId, itemId) => ({
  type: LIST_ACTIONS.MOVE_ITEM_TO_SHOPPING_LIST,
  payload: { listId, itemId },
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
