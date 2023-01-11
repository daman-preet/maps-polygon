import { useState } from 'react';
import { useColorScheme } from 'react-native';
import constate from 'constate';

import { lightColors, darkColors } from '../utils/constants';

const useAppTheme = () => {
  const initialThemeMode = useColorScheme() === 'dark' ? 'dark' : 'light';

  const [theme, setTheme] = useState<'light' | 'dark'>(initialThemeMode);

  const colors = theme === 'light' ? lightColors : darkColors;

  return {
    colors,
    theme,
    setTheme,
  };
};

export const [AppThemeProvider, useAppThemeContext] = constate(useAppTheme);
