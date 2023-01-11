import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useExitAppOnBackPress = (exit: boolean = true) => {
  const navigation = useNavigation();

  useEffect(() => {
    const onHardwareBackPress = () => {
      if (exit) {
        BackHandler.exitApp();
      } else {
        navigation.goBack();
      }
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    };
  }, [exit, navigation]);
};
