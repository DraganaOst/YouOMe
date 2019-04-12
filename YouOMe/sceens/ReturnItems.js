import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import ImageCalendar from '../images/calendar.svg';
import { ScrollView } from 'react-native-gesture-handler';


class Item extends React.Component {
    constructor(){
        super();
        this.state = {
            checked: false
        }
    }

    render() {
        return (
            <TouchableOpacity 
                style={{backgroundColor: styles.mainColorLightGrey2, marginHorizontal: 10, marginVertical: 5, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                onPressOut={this.props.onPress} onPress={() => this.setState({checked: !this.state.checked})}
            >
                <Text style={{color: 'white', fontSize: 20}}>{this.props.name}</Text>
                <View style={{backgroundColor: 'white', height: 20, width: 20, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{height: 15, width: 15, backgroundColor: this.state.checked ? styles.mainColorLightOrange : 'white'}}></View>
                </View>
            </TouchableOpacity>
        );
    }
}


export default class ReturnItems extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'i_returned',
            array: [],
            arrayItems: [],
            arrayItemsChecked: [],
            dateIncured: new Date(),
            amount: 0,
            reason: "",
            visibleDatePickerIOSIncured: false,
            userIndex: 0,
            userValue: ""
        };
    }

    componentDidMount(){
        this.loadUsers();
    }

    componentWillReceiveProps({someProp}) {
        this.setState({...this.state,someProp});
    }

    loadUsers = () => {
        Firebase.database.ref('/').once('value',
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    let data = Firebase.database.ref('/connections/' + Firebase.uid);
                    data.on('value', (snapshot) => {
                        this.setState({array: []});
                        let codeDefault = (
                            <Picker.Item key={"default"} label={""} value={'default'} />
                        );
                        this.setState((previousState) => ({'array': [...previousState.array, codeDefault]}));
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(
                                (snapshotUser) => {
                                    let code = "";
                                    if(child.val() === true){
                                        code = (
                                            <Picker.Item key={child.key} label={snapshotUser.val().username} value={child.key} />
                                        );
                                    }
                                    this.setState((previousState) => ({'array': [...previousState.array, code]}));
                                }
                            );
                        });
                    });
                }
            }
        );
    };

    isChecked = (key) => {
        let objectIndex = this.state.arrayItemsChecked.findIndex((x) => x.id == key);
        let arrayCopy = this.state.arrayItemsChecked;
        let value = this.state.arrayItemsChecked[objectIndex].checked;
        arrayCopy[objectIndex].checked = value ? false : true;
        this.setState({arrayItemsChecked: arrayCopy});
    };

    loadItems = (userId) => {
        let from = userId;
        if(this.state.option == 'i_received')
            from = Firebase.uid;

        this.setState({arrayItems: []});
        Firebase.database.ref('transactions/users/' + Firebase.uid + '/items/' + userId).once('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach((childSnapshot) => {
                    Firebase.database.ref('transactions/items/' + childSnapshot.val()).once('value', (transactionSnapshot) => {
                        if(transactionSnapshot.val().returned === false && transactionSnapshot.val().from === from){
                            this.setState((previousState) => ({arrayItemsChecked: [...previousState.arrayItemsChecked, {id: transactionSnapshot.key, checked: false}]}));
                            let code = (
                                <Item
                                    key={transactionSnapshot.key}
                                    name={transactionSnapshot.val().name}
                                    onPress={() => this.isChecked(transactionSnapshot.key)}
                                />
                            );
                            this.setState((previousState) => ({arrayItems: [...previousState.arrayItems, code]}));                       
                        }
                    });
                });
            }
        });
    };

    onPressCalendar = prop => {
        Platform.select({
            ios: () => {
                this.setState({visibleDatePickerIOSIncured: !this.state.visibleDatePickerIOSIncured});
            },
            android: async () => {
                try {
                    let maxDate = new Date();
                
                    const {action, year, month, day} = await DatePickerAndroid.open({
                        date: new Date(),
                        maxDate: maxDate
                    });
                    if (action !== DatePickerAndroid.dismissedAction) {
                        this.setState({dateIncured: new Date(year, month, day)});
                    }
                } catch ({code, message}) {
                    console.warn('Cannot open date picker', message);
                }},
          })();;
    };

    onPressReturn = () => {
        let uid = this.state.array[this.state.userIndex].key;

        for(let i=0; i<this.state.arrayItemsChecked.length; i++){
            if(this.state.arrayItemsChecked[i].checked === true){
                let object = {
                    transactionsKey: this.state.arrayItemsChecked[i].id,
                    request: Firebase.uid
                };
                //let item = Firebase.database.ref('/confirmations/items_returned').push();
                Firebase.database.ref('/confirmations/users/'+Firebase.uid+'/items_returned/'+uid).push(object);
                Firebase.database.ref('/confirmations/users/'+uid+'/items_returned/'+Firebase.uid).push(object);
            }    
        }
        

        /*let update = {};

        let balance = { owed_by_me: 0, owed_to_me: 0};
        let balanceUser = {owed_by_me: 0, owed_to_me: 0};

        let uid = this.state.array[this.state.userIndex].key;

        await Firebase.database.ref('/balance/' + Firebase.uid + '/items/'+uid).once('value').then((snapshot) => {
            if(snapshot.child('owed_by_me').exists()){
                balance.owed_by_me = snapshot.val().owed_by_me;
                balanceUser.owed_to_me = balance.owed_by_me;
            }
            if(snapshot.child('owed_to_me').exists()){
                balance.owed_to_me = snapshot.val().owed_to_me;
                balanceUser.owed_by_me = balance.owed_to_me;
            }
        });

        for(let i=0; i<this.state.arrayItemsChecked.length; i++){
            if(this.state.arrayItemsChecked[i].checked === true){
                update['transactions/items/'+ this.state.arrayItemsChecked[i].id + '/returned'] = new Date().toISOString();

                if(this.state.option === 'i_returned'){
                    balance.owed_by_me -= 1;
                    balanceUser.owed_to_me -=1
                }
                else if(this.state.option === "i_received"){
                    balance.owed_to_me -= 1;
                    balanceUser.owed_by_me -= 1;
                }
            }    
        }

        if(this.state.option === 'i_returned'){
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_by_me'] = balance.owed_by_me;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_to_me'] = balanceUser.owed_to_me;
        }
        else{
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_to_me'] = balance.owed_to_me;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_by_me'] = balanceUser.owed_by_me;
        }

        Firebase.database.ref().update(update);*/

        this.loadItems(this.state.array[this.state.userIndex].key);
    };

    onUserChangeValue = (itemValue, itemIndex) => {
        this.setState({userIndex: itemIndex});
        this.setState({userValue: itemValue});
        this.loadItems(this.state.array[itemIndex].key);
    };

    render() {
        let datePickerIOSIncured = (
            <DatePickerIOS
                style={{ height: 150 }}
                date={new Date()} onDateChange={(date)=>this.setState({dateIncured: date})}
                mode="date"/>
        );

        return (
            <View style={{flex: 1, backgroundColor: styles.mainColorGrey}}>
                <View style={styles.AddMoneyItem.containerButton}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'i_returned', arrayItems: [], arrayItemsChecked: []}), this.onUserChangeValue("default", 0))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "i_returned" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Returned</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "i_received", arrayItems: [], arrayItemsChecked: []}), this.onUserChangeValue("default", 0))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "i_received" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Received</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={{marginTop: 10, marginBottom: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>{this.state.option === 'i_returned' ? "To" : "From"}</Text>
                            <Text style={{color: 'red', fontSize: 18}}>*</Text>
                        </View>
                        <View style={{backgroundColor: styles.mainColorLightGrey, paddingLeft: 15, marginHorizontal: 10}}>
                            <Picker
                                    selectedValue={this.state.userValue}
                                    style={{height: 45}}
                                    onValueChange={(itemValue, itemIndex) => this.onUserChangeValue(itemValue, itemIndex)}
                            >
                                    {this.state.array}
                            </Picker>
                        </View>   
                    </View>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{flex:1, marginVertical: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Items</Text>
                        </View>
                    </View>
                    {this.state.arrayItems}     
                </ScrollView>
                {this.state.visibleDatePickerIOSIncured ? datePickerIOSIncured : null}
                <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.onPressReturn()} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button2]}>
                            <Text style={styles.AddMoneyItem.buttonText}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}