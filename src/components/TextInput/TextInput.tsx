import React, { ReactNode } from 'react';
import { HelperText, TextInput as RNTextInput } from 'react-native-paper';
import {
  ErrorTextStyled,
  TextInputStyled,
  TextInputViewStyled,
} from './TextInput.styled';

type RNTextInputProps = React.ComponentProps<typeof RNTextInput>;

export type CustomTextInput = {
  errorText?: string;
  withMask?: string;
  helperText?: string;
  rightIcon?: ReactNode;
  onIconPress?: any;
  borderColor?: string;
  refInput?: any;
};

export type ExtendedTextInputProps = CustomTextInput & RNTextInputProps;

export function TextInput(props: ExtendedTextInputProps) {
  const {
    withMask,
    errorText,
    helperText,
    rightIcon,
    refInput,
    style,
    ...restProps
  } = props;
  let Input = (
    <TextInputStyled
      ref={refInput}
      mode={'outlined'}
      autoCapitalize={'none'}
      autoCorrect={false}
      right={
        <TextInputStyled.Icon
          name={() => <>{rightIcon}</>}
          onPress={props.onIconPress}
        />
      }
      {...restProps}
    />
  );

  return (
    <TextInputViewStyled style={style}>
      {Input}
      {!!helperText && (
        <HelperText type={'info'} visible={true} padding={'none'}>
          {helperText}
        </HelperText>
      )}
      {!!errorText && (
        <ErrorTextStyled type={'error'} visible={true} padding={'none'}>
          {errorText}
        </ErrorTextStyled>
      )}
    </TextInputViewStyled>
  );
}
