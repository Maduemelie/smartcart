import { useState, useEffect } from 'react';
import {
  Appearance,
  useColorScheme as nativeUseColorScheme,
} from 'react-native';
import { getColors } from '../constants/Colors';

export function useColorScheme() {
  const colorScheme = nativeUseColorScheme();
  const [colors, setColors] = useState(getColors(colorScheme));

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColors(getColors(colorScheme));
    });

    return () => subscription.remove();
  }, []);

  return {
    colorScheme,
    colors,
  };
}
