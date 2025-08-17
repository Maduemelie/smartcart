// Import Google Maps API key from app.json
import Constants from 'expo-constants';

// Get Google Maps API key from app.json configuration
export const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.android?.config?.googleMaps?.apiKey || null;
// This uses the existing API key from app.json for Android