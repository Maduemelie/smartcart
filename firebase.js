// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Analytics only if supported
let analytics;
try {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }).catch(() => {
    // Analytics module not available, which is fine for React Native
  });
} catch (error) {
  // Analytics not supported in this environment
  console.log('Firebase Analytics not supported in this environment');
}

export { auth, db, analytics };
export default app;