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
import AddMoney from "./sceens/AddMoney";
import * as styles from "./components/Styles";
import AddUser from "./sceens/AddUser";
import Users from "./sceens/Users";
import Money from './sceens/Money';
import AddItems from './sceens/AddItems';
import Items from './sceens/Items';
import History from './sceens/History';

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
  },
  AddUser: {
    screen: AddUser,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: "Add User"
    },
  },
  AddMoney: {
    screen: AddMoney,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Add'
    },
  },
  Users: {
    screen: Users,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Users'
    },
  },
  Money: {
    screen: Money,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Money'
    },
  },
  AddItems: {
    screen: AddItems,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Add'
    },
  },
  Items: {
    screen: Items,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Items'
    },
  },
  History: {
    screen: History,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'History'
    },
  }
}, {
  initialRouteName: 'Login'
});

//export default createAppContainer(AppNavigator);
const Navigator = createAppContainer(AppNavigator);

export default class App extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Firebase.init();
  }

  render() {
    return (
        <Navigator/>
    );
  }
}
