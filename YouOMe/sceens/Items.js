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
                    <View style={styles.Items.containerBalance}>
                        <View >
                            <Text style={styles.Money.balanceText}>I Owe</Text>
                            <Text style={styles.Money.balanceText}>Owe's</Text>
                        </View>
                        <View>
                            <Text style={styles.Money.balance}>{this.props.balanceIOwe}</Text>
                            <Text style={styles.Money.balance}>{this.props.balanceOwes}</Text>
                        </View>
                    </View>     
                </View>
            </TouchableOpacity>
        );
    }
}

export default class Items extends React.Component {
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
        let data = Firebase.database.ref('balance/'+Firebase.uid+'/items');
        data.on('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                    
                    let owed_by_me = 0;
                    let owed_to_me = 0;
                    if(snapshot.child('owed_by_me').exists())
                        owed_by_me = childSnapshot.val().owed_by_me;
                    if(snapshot.child('owed_to_me').exists())
                        owed_to_me = childSnapshot.val().owed_to_me

                    let code = (
                        <TransactionUser key={userUid} username={username} balanceIOwe={owed_by_me} balanceOwes={owed_to_me}/>
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