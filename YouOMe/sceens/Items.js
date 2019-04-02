import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class Money extends React.Component {
    constructor(){
        super();
        this.state = {

        }
    }

    render() {
        return (
            <View>
                <Text>Hello2</Text>
            </View>
        );
    }
}