import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Button, Modal, TouchableWithoutFeedback} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

import ImageNotification from '../images/bell.svg';

export class Notifications extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Notifications',
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText,
        headerRight: (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{paddingTop: 25, paddingBottom: 25, marginBottom: 0, elevation: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: styles.mainColorGreen2}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                        <ImageNotification height={20} width={20}/>
                    </TouchableOpacity>
                </View>        
                <TouchableOpacity style={{paddingVertical: 20, paddingLeft: 20, paddingRight: 20}} onPress={() => navigation.getParam('setModalVisible')(true)}>
                    <ImageNotification height={20} width={20}/>
                </TouchableOpacity>
            </View>
            
        )
    });

    render() {
      return (
        <View>
          <Text>Hello</Text>
        </View>
      )
    };
}