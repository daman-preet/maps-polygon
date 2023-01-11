import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import { TextProps } from 'react-native-ui-lib';

import { useAppThemeContext } from '../../../hooks/useAppTheme';

const Pressable = ({ style, children, ...restProps }: TextProps) => {
  const { colors } = useAppThemeContext();

  return (
    <RNPressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1.0,
        },
        style,
      ]}
      android_ripple={{
        color: colors.lightPrimary,
      }}
      {...restProps}
    >
      {children}
    </RNPressable>
  );
};

export default Pressable;
