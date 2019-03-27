/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
console.ignoredYellowBox = ['Setting a timer'];

import React from 'react';
import Login from './sceens/Login';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Firebase from "./components/Firebase";
import SignUp from "./sceens/SignUp";
import './components/SettingTimerError';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
  },
  SignUp: {
    screen: SignUp
  }
}, {
  initialRouteName: 'Login',
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

//export default createAppContainer(AppNavigator);
const Navigator = createAppContainer(AppNavigator);

export default class App extends React.Component{
  constructor(props) {
    super(props);
    Firebase.init();
  }

  render() {
    return (
        <Navigator/>
    );
  }
}
