import theme from './../../../theme';
import styled from 'styled-components/native';

export const MainView = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

export const ItemView = styled.View`
  flex: 1;
  background-color : ${theme.colors.white};
  padding : 5px;
  margin-top : 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`

export const ListView = styled.View`
  flex: 1;
  padding: 10px;
`
export const DetailsView = styled.View`
  flex-direction: row;
  align-items: center;
`

export const ModalView = styled.View`
  background-color: ${theme.colors.white};
  padding: 20px;
  border-radius: 4px;
`
