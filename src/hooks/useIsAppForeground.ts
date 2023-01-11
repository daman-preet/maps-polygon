import { useState, useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from 'react-query';
import constate from 'constate';

const useIsAppForeground = () => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(state === 'active');
      }
      setIsForeground(state === 'active');
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return { isForeground };
};

export const [AppForegroundProvider, useIsAppForegroundContext] =
  constate(useIsAppForeground);
