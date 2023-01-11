import React, {useState, useImperativeHandle} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {useAppThemeContext} from '../../../hooks/useAppTheme';
import RenderIcon from '../../RenderIcon';
import {Dialog, Text, Pressable} from '../index';

type ActionProps = {
  icon?: string;
  label: string;
  value: string;
  buttonStyleType?: 'primary' | 'secondary';
  buttonType?: 'kind' | 'danger';
};

interface IProps {
  trigger?: React.ReactElement;
  actions?: ActionProps[];
  onClose?: (arg?: any) => void;
  onSelect?: (arg: string) => void;
  title?: string;
}

const BottomSheetForActions = React.forwardRef(
  ({trigger, actions = [], onClose, onSelect, title = ''}: IProps, ref) => {
    const {colors} = useAppThemeContext();
    const {width: windowWidth} = useWindowDimensions();

    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      openBottomSheet: () => {
        setVisible(true);
      },
    }));

    const handleClose = () => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    };

    return (
      <>
        {Boolean(trigger) && (
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              setVisible(true);
            }}>
            {trigger}
          </Pressable>
        )}

        <Dialog
          visible={visible}
          onDismiss={handleClose}
          width={windowWidth}
          height="40%"
          bottom={true}
          containerStyle={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          renderPannableHeader={() => {
            return (
              <View
                style={[
                  styles.dialogHeaderContainer,
                  {borderBottomColor: colors.lightGrey},
                ]}>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: 5,
                    paddingTop: 10,
                  }}>
                  <Pressable
                    onPress={() => {
                      handleClose();
                    }}
                    style={{
                      alignItems: 'center',
                      width: 80,
                      borderRadius: 10,
                      backgroundColor: colors.lightGrey,
                    }}>
                    <RenderIcon
                      name="FaAngleDown"
                      size={20}
                      color={colors.darkestGrey}
                    />
                  </Pressable>
                </View>

                {Boolean(title) && (
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      {title}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}>
          <View style={[styles.actionButtons]}>
            {actions.map(action => {
              const buttonColor =
                action?.buttonType === 'danger' ? colors.error : colors.primary;
              if (action?.buttonStyleType === 'primary') {
                return (
                  <Pressable
                    key={action.value}
                    style={[
                      styles.buttonWrapper,
                      {backgroundColor: buttonColor},
                    ]}
                    onPress={() => {
                      setVisible(false);
                      if (onSelect) {
                        onSelect(action?.value);
                      }
                    }}>
                    {Boolean(action?.icon) && (
                      <View style={[styles.button]}>
                        <RenderIcon
                          name={action.icon || ''}
                          color="#fff"
                          size={25}
                        />
                      </View>
                    )}
                    <Text style={[styles.text, {color: '#fff'}]}>
                      {action?.label}
                    </Text>
                  </Pressable>
                );
              }
              return (
                <Pressable
                  key={action.value}
                  style={[
                    styles.buttonWrapper,
                    {borderWidth: 2, borderColor: buttonColor},
                  ]}
                  onPress={() => {
                    setVisible(false);
                    if (onSelect) {
                      onSelect(action?.value);
                    }
                  }}>
                  {Boolean(action?.icon) && (
                    <View style={[styles.button]}>
                      <RenderIcon
                        name={action.icon || ''}
                        color={buttonColor}
                        size={25}
                      />
                    </View>
                  )}
                  <Text style={[styles.text, {color: buttonColor}]}>
                    {action?.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Dialog>
      </>
    );
  },
);
export default BottomSheetForActions;

const styles = StyleSheet.create({
  dialogHeaderContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButtons: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
