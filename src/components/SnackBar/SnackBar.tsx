import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import theme from '../../theme';
import { Text2 } from 'src/components/Typography';
import { Snackbar } from 'react-native-paper';

type IProp = {
  visible: boolean;
  messageText: string;
  onDismiss?: any;
  isError?: any;
  duration?: number;
  disableAutoDismiss?: boolean;
};

const SnackBar = (props: IProp) => {
  return (
    <View>
      <Snackbar
        visible={props.visible}
        duration={props.duration ? props.duration : 2000}
        onDismiss={() => {
          if (!props.disableAutoDismiss) {
            props.onDismiss();
          }
        }}
        style={{
          backgroundColor: props.isError
            ? theme.colors.errorRed
            : theme.colors.black90,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: props.isError ? 'flex-start' : 'center',
            justifyContent: props.isError ? 'space-evenly' : 'space-between',
            width: Dimensions.get('window').width - 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: props.isError ? 'flex-start' : 'center',
              justifyContent: 'center',
            }}>
            <Text2
              color={theme.colors.white}
              style={{
                marginBottom: -3,
                flexWrap: 'wrap',
                marginLeft: 10,
              }}>
              {props.messageText}
            </Text2>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.onDismiss();
            }}
            activeOpacity={1}>
          </TouchableOpacity>
        </View>
      </Snackbar>
    </View>
  );
};

export default SnackBar;
