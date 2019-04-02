import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

class TransactionUser extends React.Component {
    constructor(){
        this.state = {
            array: []
        }
    }

    render() {
        return (
            <View>
                <Text>{this.props.username}</Text>
                <Text>{this.props.balance}</Text>
                <Text>{this.props.balanceNumber}</Text>
            </View>
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
        let data = Firebase.database.ref('/transactions/users/'+Firebase.uid+'/money');
        data.on('value', (snapshot) => {
            snapshot.forEach(async (childSnapshot) => {
                let userUsername = "";
                let userUid = childSnapshot.key;
                let transactionId = childSnapshot.val();
                await Firebase.database.ref('users/' + childSnapshot.key).once('value').then((userSnapshot) =>{ userUsername = userSnapshot.val().username; });
                
                let owed_by_me = 0;
                let owed_to_me = 0;
                alert(childSnapshot.lenght);  
                childSnapshot.forEach(async (childUUserSnapshot) => {
                    await Firebase.database.ref('transactions/money/'+childUUserSnapshot.val()).once('value').then((transactionSnapshot) => {
                        //alert(transactionSnapshot.val().amount);
                        if(transactionSnapshot.val().from === Firebase.uid)
                            owed_to_me += transactionSnapshot.val().amount;
                        else
                            owed_by_me += transactionSnapshot.val().amount;
                    });
                    
                });

                let balance = owed_by_me > owed_to_me ? 'I owe' : "Owe's";
                if(owed_by_me == owed_to_me)
                    balance = "";


                let code = (
                    <TransactionUser key={userUid} username={userUsername} balance={balance} balanceNumber={Math.abs(owed_by_me-owed_to_me)}/>
                );

                this.setState((previousState) => {array: [...previousState.array, code]});
                
            });
        });
    };

    render() {
        return (
            <View>
                {this.state.array}
            </View>
        );
    }
}