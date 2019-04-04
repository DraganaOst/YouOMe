import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView } from 'react-native-gesture-handler';

class TransactionUser extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.Money.button} onPress={() => this.props.navigator.navigate('HistoryItems', {username: this.props.username, uid: this.props.uid})}>
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
        const navigator = this.props.navigation;
        let data = Firebase.database.ref('balance/'+Firebase.uid+'/items');
        data.on('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                    
                    let owed_by_me = 0;
                    let owed_to_me = 0;
                    if(childSnapshot.child('owed_by_me').exists())
                        owed_by_me = childSnapshot.val().owed_by_me;
                    if(childSnapshot.child('owed_to_me').exists())
                        owed_to_me = childSnapshot.val().owed_to_me;

                    let code = (
                        <TransactionUser key={userUid} uid={userUid} username={username} balanceIOwe={owed_by_me} balanceOwes={owed_to_me} navigator={navigator}/>
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