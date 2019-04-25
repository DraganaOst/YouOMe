import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import './components/SettingTimerError';
import Firebase from "./components/Firebase";
import * as styles from "./components/Styles";
import Login from './sceens/Login';
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
import Statistic from './sceens/Statistic';

//Navigation

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
      title: "Add User"
    } 
  },
  AddMoney: {
    screen: AddMoney,
    navigationOptions: {
      title: "Add"
    }
  },
  Users: {
    screen: Users,
    navigationOptions: {
      title: "Users"
    } 
  },
  Money: {
    screen: Money,
    navigationOptions: {
      title: "Money"
    } 
  },
  AddItems: {
    screen: AddItems,
    navigationOptions: {
      title: "Add"
    } 
  },
  Items: {
    screen: Items,
    navigationOptions: {
      title: "Items"
    }
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
      title: "Return items"
    }
  },
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null,
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: "Settings"
    }
  },
  Statistic: {
    screen: Statistic,
    navigationOptions: {
      title: "Statistic"
    } 
  }
}, {
  initialRouteName: 'Loading',
  defaultNavigationOptions: {
      headerStyle: styles.Profile.header,
      headerTitleStyle: styles.Profile.headerText,
      headerTintColor: 'white'
  }
});

const Navigator = createAppContainer(AppNavigator);


export default class App extends React.Component{
  constructor(props) {
    super(props);
    Firebase.init(); //set Firebase
  }

  render() {
    return (
        <Navigator />
    );
  }
}
