// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom persistence implementation for React Native
const reactNativePersistence = (storage) => {
  return {
    async _set(key, value) {
      await storage.setItem(key, value);
    },
    async _get(key) {
      return await storage.getItem(key);
    },
    async _remove(key) {
      await storage.removeItem(key);
    },
    _addListener() {},
    _removeListener() {},
    type: 'LOCAL'
  };
};

const firebaseConfig = {
  apiKey: 'AIzaSyDG0yT0g6gY5Gqh1VdsMjQ5fYb4jgU6cks',
  authDomain: 'smart-cart-app-7dbf6.firebaseapp.com',
  projectId: 'smart-cart-app-7dbf6',
  storageBucket: 'smart-cart-app-7dbf6.firebasestorage.app',
  messagingSenderId: '977281593090',
  appId: '1:977281593090:web:9d49e79969ec35331f1c1b',
  measurementId: 'G-FY1RPS56R7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export default app;