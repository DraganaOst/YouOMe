/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import Login from './sceens/Login';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Firebase from "./components/Firebase";
import SignUp from "./sceens/SignUp";
import Profile from "./sceens/Profile";
import './components/SettingTimerError';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    }
  },
  Profile: {
    screen: Profile,
  }
}, {
  initialRouteName: 'Login'
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
