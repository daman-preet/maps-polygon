import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';

import { useAppThemeContext } from '../../../hooks/useAppTheme';
import { Text } from '../index';

interface LoaderProps {
  loading?: boolean;
  title?: string;
}

const Loader = ({ loading = false, title = '' }: LoaderProps) => {
  const { colors } = useAppThemeContext();

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={loading}
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {
        console.log('close modal');
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color={colors.primary}
            size={24}
            animating={loading}
          />
          {Boolean(title) && <Text style={styles.text}>{title}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 2,
    textAlign: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 140,
    width: 140,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
