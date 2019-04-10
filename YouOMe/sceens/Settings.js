import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Button} from 'react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';




export default class Settings extends React.Component{
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    drawerLabel: 'Settings',
    /*drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),*/
  };



  render() {
    return <Text>Haaj</Text>;
  }
}
