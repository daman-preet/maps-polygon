import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { WrapperStyled } from './Main.styled';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
  navigation: any;
  route: any;
  getUserName: any;
}

export function withMainLayout<P extends IProps>(
  WrappedComponent: React.ComponentType<P>,
): React.FunctionComponent<P> {
  return props => {
    // Get Navigation Bar Height to manage keyboard offset
    const screenHeight = Dimensions.get('screen').height;
    const windowHeight = Dimensions.get('window').height;
    const insets = useSafeAreaInsets();
    const navbarHeight = screenHeight - windowHeight + insets.top + 40;
    return (
      <WrapperStyled>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: 'column',
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={navbarHeight}>
            <WrappedComponent {...props} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </WrapperStyled>
    );
  };
}
