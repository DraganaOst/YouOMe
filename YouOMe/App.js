/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import Login from './sceens/Login';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import './components/SettingTimerError';
import Firebase from "./components/Firebase";
import * as styles from "./components/Styles";
import SignUp from "./sceens/SignUp";
import Profile from "./sceens/Profile";
import AddMoney from "./sceens/AddMoney";
import AddUser from "./sceens/AddUser";
import Users from "./sceens/Users";
import Money from './sceens/Money';
import AddItems from './sceens/AddItems';
import Items from './sceens/Items';
import HistoryMoney from './sceens/HistoryMoney';
import HistoryItems from './sceens/HistoryItems';
import ReturnItems from './sceens/ReturnItems';
import Loading from './sceens/Loading';
import Settings from './sceens/Settings';

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
  HistoryMoney: {
    screen: HistoryMoney,
  },
  HistoryItems: {
    screen: HistoryItems
  },
  ReturnItems: {
    screen: ReturnItems,
    navigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white',
      title: 'Return items'
    },
  },
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null,
    }
  },
  Settings: {
    screen: Settings
  }
}, {
  initialRouteName: 'Loading'
});

const Navigator = createAppContainer(AppNavigator);


export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      auth: false
    }
    Firebase.init();
  }

  render() {
    /*if (this.state.loading) return null;

    if (this.state.auth == true) {
      return <Navigator />;
    }*/

    return (
        <Navigator />
    );
  }
}
