import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './../navigation/Navigator';
import theme from './../theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StateProvider } from 'react-redux';
import store from './../state/store';
import SnackBar from './../components/SnackBar';
import NetInfo from '@react-native-community/netinfo';
import { enableLatestRenderer } from 'react-native-maps';
import { LogBox } from 'react-native';

const App = () => {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  // returns a hook with the NetInfoState type.
  const [isOffline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !state.isConnected;
      setOfflineStatus(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  enableLatestRenderer();

  return (
    <StateProvider store={store}>
      <PaperProvider theme={theme.AppTheme}>
        <SafeAreaProvider>
          <Navigation />
          <SnackBar
            visible={isOffline}
            messageText={'Unable to load the data. Please check your network.'}
            isError={true}
            onDismiss={() => {
              setOfflineStatus(false);
            }}
            disableAutoDismiss={true}
          />
        </SafeAreaProvider>
      </PaperProvider>
    </StateProvider>
  );
};

export default App;
