import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView } from 'react-native-gesture-handler';

class TransactionUser extends React.Component {
    render() {
        let array = ['#8acb88','#648381','#575761','#ffbf46',"#E5E5E5"];
        let index = 0;
        return (
            <TouchableOpacity style={styles.Money.button} onPress={() => alert('Pressed')}>
                <View style={styles.Money.container}>
                    <Text style={styles.Money.textUser}>{this.props.username}</Text>
                    {this.props.balance != 0 
                        ? <View style={styles.Money.containerBalance}>
                            <Text style={styles.Money.balanceText}>{this.props.balanceText}</Text>
                            <Text style={styles.Money.balance}>{this.props.balance}€</Text>
                          </View>
                        : null}       
                </View>
            </TouchableOpacity>
        );
    }
}

export default class History extends React.Component {
    constructor(){
        super();
        this.state = {
            array: []
        }
    }

    render() {
        return (
            <ScrollView style={{backgroundColor: "#E5E5E5", flex: 1}}>
                {this.state.array}
            </ScrollView>
        );
    }
}