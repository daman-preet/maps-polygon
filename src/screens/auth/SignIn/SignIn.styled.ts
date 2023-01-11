import styled from 'styled-components/native';
import theme from '../../../theme';
import { TextInput } from './../../../components';
import { Heading } from './../../../components/Typography'

export const MainView = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${theme.colors.white};
`;

export const PasswordInput = styled(TextInput)`
  margin-top: 20px;
  margin-bottom: 16px;
`;

export const HeadingText = styled(Heading)`
  text-align: center;
  font-style: italic;
  font-size: 70px;
  padding: 50px;
`;