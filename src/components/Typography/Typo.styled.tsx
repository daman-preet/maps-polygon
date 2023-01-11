import styled from 'styled-components/native';
import {
  Title,
  Subheading,
  Paragraph,
  Text,
  Caption,
} from 'react-native-paper';
import theme from '../../theme';
import { CustomTextProp } from './Typo';

export const TitleStyled = styled(Title)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 700};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0px;
`;

export const HeadingStyled = styled(Text)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 700};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0px;
`;

export const SubheadingStyled = styled(Subheading)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 700};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0px;
`;

export const ParagraphStyled = styled(Paragraph)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 400};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  opacity: ${(props: CustomTextProp) => (props.color ? 1 : 0.8)};
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0px;
`;

export const Text1Styled = styled(Text)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 500};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  opacity: ${(props: CustomTextProp) => (props.color ? 1 : 0.8)};
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0px;
`;

export const Text2Styled = styled(Text)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 500};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  opacity: ${(props: CustomTextProp) => (props.color ? 1 : 0.8)};
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0px;
`;

export const CaptionStyled = styled(Caption)<CustomTextProp>`
  font-weight: ${(props: CustomTextProp) =>
    props.fontWeight ? props.fontWeight : 500};
  color: ${(props: CustomTextProp) =>
    props.color ? props.color : theme.colors.black90};
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0px;
`;
