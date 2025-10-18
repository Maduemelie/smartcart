// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Use environment variables or Expo Constants
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    Constants.expoConfig?.extra?.FIREBASE_API_KEY,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    Constants.expoConfig?.extra?.FIREBASE_APP_ID,
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID,
};

// Validate config
const requiredConfig = ['apiKey', 'authDomain', 'projectId'];
const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  throw new Error(
    `Firebase config is missing the following keys: ${missingConfig.join(
      ', '
    )}. Please check your environment variables or app.json.`
  );
}

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // You could also throw the error to halt app startup if Firebase is critical
}

// Export services for use in other parts of the app
export { auth, db };
