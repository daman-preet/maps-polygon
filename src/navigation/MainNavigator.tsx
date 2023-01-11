import React, { useEffect } from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import theme from './../theme';
import {
  MainNavigationScreen,
  customHeaderStyle,
} from './Navigator';

// Main Screens
import Home from './../screens/main/Home';

// Root stack navigator
const RootStack = createStackNavigator();

// Main Screens Navigator
const MainStack = createStackNavigator();

// Navigation Stack for Main Screens
const MainNavigator = () => {
  
  return (
    <MainStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerBackTitleVisible: false,
        headerStyle: customHeaderStyle,
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      }}
      initialRouteName={MainNavigationScreen.Home}>
        
      <MainStack.Screen
        name={MainNavigationScreen.Home}
        component={Home}
      />
    </MainStack.Navigator>
  );
};

// Navigation Stack for Root Screens
const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{
      presentation: 'modal'
    }}>
      <RootStack.Screen
        name={'Main'}
        options={{ headerShown: false }}
        component={MainNavigator}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
