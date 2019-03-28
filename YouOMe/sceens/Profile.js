import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class Profile extends React.Component {
    constructor(){
        super();
        this.state = {

        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: Firebase.username,
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText
        /*headerRight: (
            <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#000"
            />
        ),*/
    });

    render() {
        return (
            <View style={styles.Profile.container} >
                <View>
                    <Text>Money</Text>
                </View>
                <View>
                    <Text>Items</Text>
                </View>
                <View>
                    <Text>People</Text>
                </View>
            </View>
        );
    }
}
