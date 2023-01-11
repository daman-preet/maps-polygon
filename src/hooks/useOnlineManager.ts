import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from 'react-query';
import constate from 'constate';

const useOnlineManager = () => {
  const [isOnline, setIsOnline] = useState(false);

  const checkOnlineStatusForIOS = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isUserOnline = state.isConnected != null && state.isConnected;

      console.log('>>>> connection change', {
        connected: state.isConnected,
        type: state.type,
      });

      setIsOnline(isUserOnline);
    });

    return unsubscribe();
  }, []);

  const checkOnlineStatusForAndroid = useCallback(() => {
    NetInfo.fetch().then((state) => {
      const isUserOnline = state.isConnected != null && state.isConnected;

      console.log('>>>> connection change', {
        connected: state.isConnected,
        type: state.type,
      });

      setIsOnline(isUserOnline);
    });
  }, []);

  useEffect(() => {
    // React Query already supports on reconnect auto refetch in web browser
    if (Platform.OS !== 'web') {
      if (Platform.OS === 'android') {
        const intervalId = setInterval(checkOnlineStatusForAndroid, 5000);
        return () => clearInterval(intervalId);
      } else {
        return checkOnlineStatusForIOS();
      }
    }
  }, [checkOnlineStatusForAndroid, checkOnlineStatusForIOS]);

  useEffect(() => {
    onlineManager.setOnline(isOnline);
  }, [isOnline]);

  return { isOnline };
};

export const [OnlineManagerProvider, useOnlineManagerContext] =
  constate(useOnlineManager);
