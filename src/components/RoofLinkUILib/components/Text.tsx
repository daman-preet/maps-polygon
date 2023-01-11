import React from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from 'react-native-ui-lib';

const Text = ({ style, children, ...restProps }: TextProps) => {
  return (
    // <RNText style={[{ fontFamily: 'Poppins' }, style]} {...restProps}>
    <RNText style={[style]} {...restProps}>
      {children}
    </RNText>
  );
};

export default Text;
