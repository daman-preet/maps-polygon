import { colors } from './colors';
import sizes from './sizes';
import { configureFonts, DefaultTheme } from 'react-native-paper';

const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'Lato-Regular',
    },
    medium: {
      fontFamily: 'Lato-Regular',
    },
    light: {
      fontFamily: 'Lato-Regular',
    },
    thin: {
      fontFamily: 'Lato-Regular',
    },
  },
  android: {
    regular: {
      fontFamily: 'Lato-Regular',
    },
    medium: {
      fontFamily: 'Lato-Regular',
    },
    light: {
      fontFamily: 'Lato-Regular',
    },
    thin: {
      fontFamily: 'Lato-Regular',
    },
  },
};

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    text: colors.black90,
    background: colors.white,
    error: colors.errorRed,
  },
  fonts: configureFonts(fontConfig),
};

export default {
  colors,
  AppTheme,
  sizes,
};
