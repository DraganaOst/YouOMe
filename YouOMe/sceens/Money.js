import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { whileStatement } from '@babel/types';
import ImageCheck from '../images/checked_2.svg';
import ImageCancel from '../images/cancel.svg';

class TransactionUser extends React.Component {
    render() {
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

class Confirmation extends React.Component {
    onDelete = props => {
        let update = {};
        update['confirmations/money/'+props.keyTransaction] = null;
        Firebase.database.ref().update(update);

        /*Firebase.database.ref('confirmations/users/'+props.transaction.from+'/money/'+props.transaction.to).once('value').then((snapshot) =>{
            if(snapshot.exists()){
                if(snapshot.val() == props.keyTransaction)
                    snapshot.remove();
            }
        });*/
        //update['confirmations/users/'+props.transaction.from+'/money/'+props.transaction.to+'/'+props.keyUser] = null;
        //update['confirmations/users/'+props.transaction.to+'/money/'+props.transaction.from+'/'+props.keyUser] = null;

        //
    };

    render() {
        let style = this.props.transaction.request == Firebase.uid ? {alignItems: 'center'} : null;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, backgroundColor: 'white'}}>
                {this.props.transaction.request == Firebase.uid
                ? 
                    null
                :
                    <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 20, paddingVertical: 10}} >
                        <ImageCancel width={20} height={20} />
                    </TouchableOpacity>
                }
                <View style={{flexDirection: 'row', paddingHorizontal: 20, style}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.transaction.amount}€</Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.transaction.from == Firebase.uid ? " to " : ' from '}</Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.props.user}</Text>
                </View>
                {this.props.transaction.request == Firebase.uid
                ? 
                    <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.onDelete(this.props)}>
                        <ImageCancel width={20} height={20} />
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{backgroundColor: styles.mainColorGreen, paddingHorizontal: 20, paddingVertical: 10}}>
                        <ImageCheck width={20} height={20} />
                    </TouchableOpacity>
                }  
            </View>
        );
    }
}

export default class Money extends React.Component {
    constructor(){
        super();
        this.state = {
            array: [],
            confirmation: [],
            confirmationVisible: false
        }
    }

    componentDidMount(){
        this.loadTransactions();
        this.loadConfirmations();
    }

    loadConfirmations = () => {
        const navigator = this.props.navigation;
        Firebase.database.ref('confirmations/users/' + Firebase.uid + '/money').on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({confirmation: []});
                snapshot.forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});

                    childSnapshot.forEach((subChildSnapshot) => {
                        Firebase.database.ref('confirmations/money/'+subChildSnapshot.val()).once('value').then((confirmation) => {
                            let object = ({
                                key: confirmation.key,
                                keyUser: subChildSnapshot.key,
                                keyTransaction: confirmation.key,
                                username: username,
                                userUid: userUid,
                                transaction: confirmation.val()
                            });
                            this.setState((previousState) => ({confirmation: [...previousState.confirmation, object]}));
                        })
                    });
                    
                });
            }
        });
    };

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
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: "#E5E5E5"}}>
                    {this.state.array}
                </ScrollView>
                {this.state.confirmation.length > 0 
                ?
                    <View style={{backgroundColor: styles.mainColorOrange, maxHeight: '30%'}}>
                        <TouchableOpacity onPress={() => this.setState({confirmationVisible: !this.state.confirmationVisible})}>
                            <Text style={{color: 'white', fontSize: 20, paddingHorizontal: 20, paddingVertical: 5, fontWeight: 'bold'}}>Need confirmation</Text>
                        </TouchableOpacity>
                        {this.state.confirmationVisible 
                        ?
                            <FlatList 
                                style={{backgroundColor: styles.mainColorLightOrange}}
                                data={this.state.confirmation}  
                                renderItem={({item}) => (
                                    <Confirmation
                                        key={item.key}
                                        transaction={item.transaction}
                                        user={item.username}
                                        keyTransaction={item.keyTransaction}
                                        keyUser={item.keyUser}
                                    />
                                )}         
                            />
                        : 
                            null
                        }
                    </View>
                :
                    null
                }               
            </View>
            
        );
    }
}