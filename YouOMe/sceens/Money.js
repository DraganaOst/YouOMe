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
            <TouchableOpacity style={styles.Money.button} onPress={() => this.props.navigator.navigate('HistoryMoney', {username: this.props.username, uid: this.props.uid})}>
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

export default class Money extends React.Component {
    constructor(){
        super();
        this.state = {
            array: []
        }
    }

    componentDidMount(){
        this.loadTransactions();
    }

    loadTransactions = () => {
        const navigator = this.props.navigation;

        let data = Firebase.database.ref('balance/'+Firebase.uid+'/money');
        data.on('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    let balace = childSnapshot.val();
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});

                    let balanceText = 'I Owe';
                    if(balace < 0)
                        balanceText = "Owe's";
                    else if(balace == 0)
                        balanceText = '';
                    


                    let code = (
                        <TransactionUser key={userUid} uid={userUid} username={username} balanceText={balanceText} balance={Math.abs(balace)} navigator={navigator}/>
                    );
    
                    this.setState((previousState) => ({'array': [...previousState.array, code]}));
                });
            }
        });
    };

    render() {
        return (
            <ScrollView style={{backgroundColor: "#E5E5E5", flex: 1}}>
                {this.state.array}
            </ScrollView>
        );
    }
}