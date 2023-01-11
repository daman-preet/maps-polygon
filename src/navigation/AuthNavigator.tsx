import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  NavigationScreen,
  customHeaderStyle,
} from './Navigator';

// Screens
import SignIn from './../screens/auth/SignIn';

const RootStack = createStackNavigator();

// Navigation Stack for Authentication Screen
const AuthNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerBackTitleVisible: false,
        headerStyle: customHeaderStyle,
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      }}
      initialRouteName={NavigationScreen.login}>
        
      <RootStack.Screen
        name={NavigationScreen.login}
        component={SignIn}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default AuthNavigator;
