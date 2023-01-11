import styled from 'styled-components/native';
import { HelperText, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import theme from 'src/theme';
import { FontWeights } from '../Typography';
import { rgba } from 'polished';
import { CustomTextInput } from './TextInput';

export const TextInputViewStyled = styled(View)``;

export const TextInputStyled = styled(TextInput).attrs(
  (prop: CustomTextInput) => {
    return {
      theme: {
        roundness: 6,
        colors: {
          placeholder: prop.borderColor
            ? prop.borderColor
            : rgba(theme.colors.black90, 0.4),
          primary: prop.borderColor ? prop.borderColor : theme.colors.primary,
        },
      },
    };
  },
)``;

export const ErrorTextStyled = styled(HelperText)`
  font-weight: ${FontWeights.medium};
  font-size: 14px;
  color: ${theme.colors.errorRed};
`;
