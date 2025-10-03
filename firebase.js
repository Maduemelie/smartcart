import { initializeApp } from 'firebase/app';
// eslint-disable-next-line import/no-unresolved
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // <-- This is the correct import for persistence in Expo
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // <-- Removed EXPO_PUBLIC_
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  // measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// ... rest of your firebase.js

// Validate the Firebase configuration to prevent runtime errors, especially in preview/production.
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  // This will crash the app with a clear error message if the .env file is not configured correctly.
  throw new Error(
    `Firebase config is missing required keys: ${missingKeys.join(
      ', '
    )}. Please check your environment variables.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
// This allows users to stay logged in
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
