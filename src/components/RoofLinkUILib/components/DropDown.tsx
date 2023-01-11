import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  Picker,
  Dialog,
  PanningProvider,
  PickerModes,
  PickerValue,
} from 'react-native-ui-lib';
import {
  PickerMultiValue,
  PickerSingleValue,
} from 'react-native-ui-lib/src/components/picker/types';
import { isArray, isPlainObject } from 'lodash';

import { useAppThemeContext } from '../../../hooks/useAppTheme';
import RenderIcon from '../../RenderIcon';
import Text from './Text';
import { Pressable } from '../index';

export type DropDownProps = {
  options?: Choice[];
  initialValue?: PickerValue;
  onSelect?: (arg: any) => void;
  dialogTitle?: string;
  placeholder?: string;
  mode?: PickerModes;
  creatable?: boolean;
  creatableInputPlaceholder?: string;
  hasError?: boolean;
  dialogHeight?: string;
  isLoading?: boolean;
};

const DropDown = ({
  options = [],
  initialValue = undefined,
  onSelect,
  dialogTitle = '',
  placeholder = '',
  mode = PickerModes.SINGLE,
  creatable = false,
  creatableInputPlaceholder = 'Add Item',
  hasError = false,
  dialogHeight = '60%',
  isLoading = false,
  ...restProps
}: DropDownProps) => {
  const { height, width } = useWindowDimensions();
  const { colors } = useAppThemeContext();

  const [searchText, setSearchText] = useState('');
  const [choices, setChoices] = useState(options);
  const [selectedItem, setSelectedItem] = useState(initialValue);
  const [selectedItems, setSelectedItems] = useState(initialValue);

  useEffect(() => {
    setChoices(options);
  }, [options]);

  useEffect(
    () => {
      if (
        mode === 'MULTI' &&
        JSON.stringify(initialValue) !== JSON.stringify(selectedItems)
      ) {
        setSelectedItems(initialValue);
      } else if (
        JSON.stringify(initialValue) !== JSON.stringify(selectedItem)
      ) {
        setSelectedItem(initialValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValue],
  );

  const createItem = (cb = () => {}) => {
    const alreadyExists = choices.some(
      (option) => option?.label.toLowerCase() === searchText.toLowerCase(),
    );
    if (searchText.length > 0 && !alreadyExists) {
      let newItem = { value: searchText, label: searchText };
      let newItems = [newItem, ...choices];
      setChoices(newItems);
      if (mode === 'MULTI' && Array.isArray(selectedItems)) {
        setSelectedItems([...selectedItems, newItem.value]);
        if (onSelect) {
          onSelect([...selectedItems, newItem.value]);
        }
      } else {
        setSelectedItem(newItem);
        if (onSelect) {
          onSelect(newItem);
        }
      }
      setSearchText('');
      cb();
    }
  };

  const getDropdownLabel = (selectedValue: any) => {
    if (isArray(selectedValue)) {
      const selectedOptions = choices?.filter((choice) =>
        selectedValue.includes(choice.value),
      );
      return selectedOptions?.map((option) => option.label).join(', ');
    }
    if (isPlainObject(selectedValue)) {
      return selectedValue?.label ?? '';
    }
    return '';
  };

  if (choices?.length) {
    return (
      <React.Fragment key={dialogTitle}>
        {/* @ts-expect-error */}
        <Picker
          key={dialogTitle}
          containerStyle={{ height: 50 }}
          placeholder={placeholder}
          floatingPlaceholder={false}
          value={
            mode === PickerModes.MULTI
              ? (selectedItems as PickerMultiValue)
              : (selectedItem as PickerSingleValue)
          }
          mode={mode}
          getLabel={getDropdownLabel}
          onChange={(val: any) => {
            if (mode === PickerModes.MULTI) {
              setSelectedItems(val);
            } else {
              setSelectedItem(val);
            }
            if (onSelect) {
              onSelect(val);
            }
          }}
          getItemValue={(item: any) =>
            mode === PickerModes.MULTI ? item : (item as any)?.value
          }
          style={[
            styles.dropDownContainer,
            {
              borderColor: hasError ? colors.error : colors.lightGrey,
              color: colors.darkestGrey,
              borderStyle: 'solid',
              borderWidth: hasError ? 2 : 1,
              borderRadius: 5,
            },
          ]}
          {...restProps}
          // @ts-expect-error
          renderCustomModal={({ visible, children, toggleModal, onDone }) => {
            return (
              <Dialog
                visible={visible}
                onDismiss={() => {
                  onDone();
                  setSearchText('');
                  toggleModal(false);
                }}
                width={width}
                height={dialogHeight}
                bottom={true}
                containerStyle={{
                  backgroundColor: colors.background,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                renderPannableHeader={() => (
                  <View
                    style={[
                      styles.dialogHeaderContainer,
                      { borderBottomColor: colors.lightGrey },
                    ]}
                  >
                    <View style={styles.dialogHeader}>
                      <Text style={[styles.dialogTitle, { flexGrow: 1 }]}>
                        {dialogTitle}
                      </Text>
                      {mode === 'MULTI' && (
                        <Pressable
                          onPress={() => {
                            toggleModal(false);
                            onDone();
                          }}
                          style={[
                            styles.dialogInputButton,
                            {
                              alignItems: 'center',
                              backgroundColor: colors.primary,
                            },
                          ]}
                        >
                          <Text style={styles.dialogInputButtonText}>
                            Select
                          </Text>
                        </Pressable>
                      )}
                      <Pressable
                        style={styles.dialogCloseButton}
                        onPress={() => {
                          toggleModal(false);
                        }}
                      >
                        <RenderIcon
                          name="MdClose"
                          size={24}
                          color={colors.darkestGrey}
                        />
                      </Pressable>
                    </View>

                    {creatable && (
                      <View style={styles.dialogInputContainer}>
                        <TextInput
                          onChangeText={(val) => setSearchText(val)}
                          value={searchText}
                          placeholder={creatableInputPlaceholder}
                          style={[
                            styles.dialogInput,
                            { color: colors.darkestGrey },
                          ]}
                        />
                        <Pressable
                          onPress={() => {
                            if (mode === 'MULTI') {
                              createItem();
                            } else {
                              createItem(() => {
                                toggleModal(false);
                              });
                            }
                          }}
                          style={[
                            styles.dialogInputButton,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text style={styles.dialogInputButtonText}>Add</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
                panDirection={PanningProvider.Directions.DOWN}
                pannableHeaderProps={{ dialogTitle }}
              >
                <ScrollView
                  contentContainerStyle={[
                    styles.dialogScrollView,
                    { paddingBottom: height * 0.05 },
                  ]}
                >
                  {children}
                </ScrollView>
              </Dialog>
            );
          }}
          migrateTextField={true}
        >
          {choices.map((option, index) => (
            <Picker.Item
              key={index}
              value={option.value}
              label={option.label}
              labelStyle={[styles.pickerItem, { color: colors.text }]}
            />
          ))}

          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator />
              <Text style={{ marginLeft: 5 }}>Loading Options...</Text>
            </View>
          )}
        </Picker>
      </React.Fragment>
    );
  } else {
    return (
      // @ts-expect-error
      <Picker
        containerStyle={{ height: 50 }}
        placeholder={placeholder}
        floatingPlaceholder={false}
        value={
          mode === PickerModes.MULTI
            ? (selectedItems as PickerMultiValue)
            : (selectedItem as PickerSingleValue)
        }
        mode={mode}
        getLabel={getDropdownLabel}
        onChange={(val: any) => {
          if (mode === PickerModes.MULTI) {
            setSelectedItems(val);
          } else {
            setSelectedItem(val);
          }
          if (onSelect) {
            onSelect(val);
          }
        }}
        getItemValue={(item: any) =>
          mode === PickerModes.MULTI ? item : (item as any)?.value
        }
        style={[
          styles.dropDownContainer,
          {
            borderColor: hasError ? colors.error : colors.lightGrey,
            color: colors.darkestGrey,
            borderStyle: 'solid',
            borderWidth: hasError ? 2 : 1,
            borderRadius: 5,
          },
        ]}
        {...restProps}
        // @ts-expect-error
        renderCustomModal={({ visible, children, toggleModal, onDone }) => {
          return (
            <Dialog
              visible={visible}
              onDismiss={() => {
                onDone();
                setSearchText('');
                toggleModal(false);
              }}
              width={width}
              height={dialogHeight}
              bottom={true}
              containerStyle={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              renderPannableHeader={() => (
                <View
                  style={[
                    styles.dialogHeaderContainer,
                    { borderBottomColor: colors.lightGrey },
                  ]}
                >
                  <View style={styles.dialogHeader}>
                    <Text style={[styles.dialogTitle, { flexGrow: 1 }]}>
                      {dialogTitle}
                    </Text>
                    {mode === 'MULTI' && (
                      <Pressable
                        onPress={() => {
                          toggleModal(false);
                          onDone();
                        }}
                        style={[
                          styles.dialogInputButton,
                          {
                            alignItems: 'center',
                            backgroundColor: colors.primary,
                          },
                        ]}
                      >
                        <Text style={styles.dialogInputButtonText}>Select</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={styles.dialogCloseButton}
                      onPress={() => {
                        toggleModal(false);
                      }}
                    >
                      <RenderIcon
                        name="MdClose"
                        size={24}
                        color={colors.darkestGrey}
                      />
                    </Pressable>
                  </View>

                  {creatable && (
                    <View style={styles.dialogInputContainer}>
                      <TextInput
                        onChangeText={(val) => setSearchText(val)}
                        value={searchText}
                        placeholder={creatableInputPlaceholder}
                        style={[
                          styles.dialogInput,
                          { color: colors.darkestGrey },
                        ]}
                      />
                      <Pressable
                        onPress={() => {
                          if (mode === 'MULTI') {
                            createItem();
                          } else {
                            createItem(() => {
                              toggleModal(false);
                            });
                          }
                        }}
                        style={[
                          styles.dialogInputButton,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.dialogInputButtonText}>Add</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
              panDirection={PanningProvider.Directions.DOWN}
              pannableHeaderProps={{ dialogTitle }}
            >
              <ScrollView
                contentContainerStyle={[
                  styles.dialogScrollView,
                  { paddingBottom: height * 0.05 },
                ]}
              >
                {children}
              </ScrollView>
            </Dialog>
          );
        }}
        migrateTextField={true}
      >
        {choices.map((option, index) => (
          <Picker.Item
            key={index}
            value={option.value}
            label={option.label}
            labelStyle={[styles.pickerItem, { color: colors.text }]}
          />
        ))}

        <View style={styles.loader}>
          <Text style={{ marginLeft: 5 }}>No Options available</Text>
        </View>
      </Picker>
    );
  }
};

export default DropDown;

const styles = StyleSheet.create({
  dialogScrollView: {
    flexGrow: 1,
  },
  dropDownContainer: {
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 14,
    minHeight: 50,
    paddingLeft: 12,
  },
  dialogHeaderContainer: {
    flexDirection: 'column',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderWidth: 0,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  dialogCloseButton: {
    alignItems: 'flex-end',
    marginLeft: 20,
  },
  pickerItem: {
    fontSize: 14,
  },
  dialogInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dialogInput: {
    height: 36,
    borderRadius: 8,
    paddingLeft: 8,
    flexGrow: 1,
    marginRight: 16,
  },
  dialogInputButton: {
    height: 36,
    width: 64,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogInputButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
