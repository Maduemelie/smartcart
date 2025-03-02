import { createContext, useContext } from 'react';
import { Appearance } from 'react-native';

const LightColors = {
  primary: '#7C3AED', // Main brand color
  secondary: '#5B21B6', // Secondary actions
  accent: '#A78BFA', // Highlights
  background: '#FFFFFF', // Main background
  surface: '#F5F3FF', // Cards, sections
  error: {
    main: '#DC2626',
    light: '#FEE2E2',
    dark: '#991B1B',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    error: '#DC2626',
  },
};

const DarkColors = {
  primary: '#8B5CF6',
  secondary: '#6D28D9',
  accent: '#A78BFA',
  background: '#1F2937',
  surface: '#374151',
  error: {
    main: '#EF4444',
    light: '#7F1D1D',
    dark: '#FCA5A5',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    inverse: '#1F2937',
    error: '#FCA5A5',
  },
};

export const ColorSchemeContext = createContext({
  theme: 'light',
  colors: LightColors,
});

export const useThemeColors = () => {
  const { colors } = useContext(ColorSchemeContext);
  return colors;
};

export const getColors = (scheme) => {
  return scheme === 'dark' ? DarkColors : LightColors;
};

// Get initial color scheme
const colorScheme = Appearance.getColorScheme();

// Export dynamic Colors object
export const Colors = colorScheme === 'dark' ? DarkColors : LightColors;

// Add listener for theme changes
// Appearance.addChangeListener(({ colorScheme }) => {
//   Object.assign(Colors, colorScheme === 'dark' ? DarkColors : LightColors);
// });
