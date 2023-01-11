import React, {useMemo, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import theme from './../theme';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStore from './../storage/AsyncStore';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty'
import {useSelector} from 'react-redux';
import {getLoginData} from './../state/auth/authReducer';

// Navigation Header Bar Style
export const customHeaderStyle = {
  backgroundColor: theme.colors.white,
  shadowColor: theme.colors.black90,
  shadowRadius: 3,
};

// Set Auth Navigation Enum
export const NavigationScreen = {
  login: 'Login',
};

// Set Main Navigation Enum
export const MainNavigationScreen = {
  Home: 'Home',
};

const Navigation = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const loginData = useSelector(state => getLoginData(state));
  
  // check is user have all info and its logged in

  const getInfoFromStorage = async () => {
    try {
      await AsyncStore.getItem('loginData', {}).then(data => {
        if (!isEmpty(get(data, 'email', ''))) {
          setIsUserLoggedIn(true);
        } else {
          setIsUserLoggedIn(false);
        }
      });
    } catch (error) {
      console.log('error fetching login data', error);
    }
  };

  useEffect(() => {
    getInfoFromStorage();
  }, [loginData]);

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Navigation;
