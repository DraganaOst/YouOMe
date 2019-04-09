import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import ImageCalendar from '../images/calendar.svg';
import { ScrollView } from 'react-native-gesture-handler';

export default class AddMoney extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'i_gave',
            array: [],
            dateIncured: new Date(),
            dateDue: "",
            amount: 0,
            reason: "",
            visibleDatePickerIOSDue: false,
            visibleDatePickerIOSIncured: false,
            userIndex: 0,
            userValue: ""
        };
    }

    componentDidMount(){
        this.loadUsers();
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
                                        this.setState((previousState) => ({'array': [...previousState.array, code]}));
                                    }
                                }
                            );
                        });
                    });
                }
            }
        );
    };

    onPressCalendar = prop => {
        Platform.select({
            ios: () => {
                if(prop === 'due')
                    this.setState({visibleDatePickerIOSDue: !this.state.visibleDatePickerIOSDue});
                else
                    this.setState({visibleDatePickerIOSIncured: !this.state.visibleDatePickerIOSIncured});
            },
            android: async () => {
                try {
                    let minDate = prop === 'due' ? this.state.dateIncured : new Date(2000);
                
                    const {action, year, month, day} = await DatePickerAndroid.open({
                        date: new Date(),
                        minDate: minDate
                    });
                    if (action !== DatePickerAndroid.dismissedAction) {
                        if(prop === 'due')
                            this.setState({dateDue: new Date(year, month, day)});
                        else
                            this.setState({dateIncured: new Date(year, month, day)});
                    }
                } catch ({code, message}) {
                    console.warn('Cannot open date picker', message);
                }},
          })();;
    };

    onPressAddMoney = async () => {
        let alertMessange = "Form wasn't filled in correctly: \n";

        if(this.state.userIndex === 0)
            alertMessange += " - choose a user\n";
        if(this.state.amount == 0)
            alertMessange += " - write the amount";
        if(this.state.amount.toString() === "NaN")
            alertMessange += " - written amount is not valide";

        if(alertMessange !== "Form wasn't filled in correctly: \n")
            alert(alertMessange);
        else{
            let update = {};
            let ref = Firebase.database.ref('/confirmations/money');
            let uid = this.state.array[this.state.userIndex].key;

            /*let balance = 0;
            let balanceUser = 0;

            await Firebase.database.ref('balance/'+Firebase.uid+'/money/'+uid).once('value').then((snapshot) => {
                if(snapshot.exists()){
                    balance = Number(snapshot.val());
                    balanceUser = balance * -1;
                }
            });*/

            let from = Firebase.uid;
            let to = uid;
        
            if(this.state.option === 'i_received'){
                from = uid;
                to = Firebase.uid;
                //update['balance/'+Firebase.uid+'/money/'+uid] = balance + this.state.amount;
                //update['balance/'+uid+'/money/'+Firebase.uid] = balanceUser - this.state.amount;
            }
            else{
                //update['balance/'+Firebase.uid+'/money/'+uid] = balance - this.state.amount;
                //update['balance/'+uid+'/money/'+Firebase.uid] = balanceUser + this.state.amount;
            }
            //Firebase.database.ref().update(update);
            
            let item = ref.push(
                {
                    'from': from, 
                    'to': to, 
                    'reason': this.state.reason,
                    'amount': this.state.amount,
                    'date_incured': this.state.dateIncured.toISOString(),
                    'date_due': this.state.dateDue !== "" ? this.state.dateDue.toISOString() : "",
                    'returned': false,
                    'request': Firebase.uid
                }
            );

            Firebase.database.ref('/confirmations/users/'+Firebase.uid+'/money/'+uid).push(item.key);
            Firebase.database.ref('/confirmations/users/'+uid+'/money/'+Firebase.uid).push(item.key);

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Profile' })
                ],
            }))
        }
    };

    render() {
        let datePickerIOSDue = (
            <DatePickerIOS
                style={{ height: 150 }}
                date={new Date()} onDateChange={(date)=>this.setState({dateDue: date})}
                mode="date"/>
        );

        let datePickerIOSIncured = (
            <DatePickerIOS
                style={{ height: 150 }}
                date={new Date()} onDateChange={(date)=>this.setState({dateIncured: date})}
                mode="date"/>
        );

        return (
            <View style={{flex: 1, backgroundColor: styles.mainColorGrey}}>
                <View style={styles.AddMoneyItem.containerButton}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'i_gave'}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "i_gave" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Gave</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "i_received"}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "i_received" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Received</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{flex:1, marginTop: 10, marginBottom: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>{this.state.option === 'i_gave' ? "To" : "From"}</Text>
                            <Text style={{color: 'red', fontSize: 18}}>*</Text>
                        </View>
                        <View style={{backgroundColor: styles.mainColorLightGrey, paddingLeft: 15, marginHorizontal: 10}}>
                            <Picker
                                    selectedValue={this.state.userValue}
                                    style={{height: 45}}
                                    onValueChange={(itemValue, itemIndex) =>(
                                        this.setState({userIndex: itemIndex}),
                                        this.setState({userValue: itemValue})
                                    )
                                    }>
                                    {this.state.array}
                            </Picker>
                        </View>   
                    </View>
                    <View style={{flex:1, marginVertical: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Amount</Text>
                            <Text style={{color: 'red', fontSize: 18}}>*</Text>
                        </View>
                        <View style={{flexDirection: 'row', backgroundColor: styles.mainColorLightGrey, alignItems: 'center', paddingHorizontal: 20, marginHorizontal: 10}}>
                            <TextInput keyboardType={'numeric'} style={styles.AddMoneyItem.inputMoney} onChangeText={(number) => {this.setState({amount: Number(number)})}}></TextInput>
                            <Text style={styles.AddMoneyItem.textFont}>€</Text>
                        </View>   
                    </View>
                    <View style={{flex:1, marginVertical: 5}}>
                        <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Reason</Text>
                        <View style={{backgroundColor: styles.mainColorLightGrey, marginHorizontal: 10}}>
                            <TextInput style={styles.AddMoneyItem.inputReason} onChangeText={(text) => this.setState({reason: text})}></TextInput>
                        </View>       
                    </View>
                    <View style={{flex:1, marginVertical: 5}}>
                        <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Date incured</Text>     
                        <TouchableOpacity style={{backgroundColor: styles.mainColorLightGrey, paddingHorizontal: 20, marginHorizontal: 10}} onPress={() => this.onPressCalendar('incured')}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.AddMoneyItem.dateText}>{this.state.dateIncured.toDateString()}</Text>
                                <ImageCalendar width={24} height={24} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, marginVertical: 5}}>
                        <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Date due</Text>     
                        <TouchableOpacity style={{backgroundColor: styles.mainColorLightGrey, paddingHorizontal: 20, marginHorizontal: 10}} onPress={() => this.onPressCalendar('due')}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.AddMoneyItem.dateText}>{this.state.dateDue !== "" ? this.state.dateDue.toDateString(): ""}</Text>
                                <ImageCalendar width={24} height={24} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                
                {/*<View style={{backgroundColor: 'white', margin: 10}}>
                    <View style={styles.AddMoneyItem.containerViewRow}>
                        <Text style={styles.AddMoneyItem.textFont}>{this.state.option === 'i_gave' ? "To" : "From"}</Text>
                        <Text style={[styles.AddMoneyItem.textFont, {color: 'red'}]}>*</Text>
                        <Text style={styles.AddMoneyItem.textFont}>: </Text>
                        <Picker
                            selectedValue={this.state.userValue}
                            style={styles.AddMoneyItem.picker}
                            onValueChange={(itemValue, itemIndex) =>(
                                this.setState({userIndex: itemIndex}),
                                this.setState({userValue: itemValue})
                            )
                            }>
                            {this.state.array}
                        </Picker>
                    </View>
                    <View style={styles.AddMoneyItem.containerViewRow}>
                        <Text style={styles.AddMoneyItem.textFont}>Amount</Text>
                        <Text style={[styles.AddMoneyItem.textFont, {color: 'red'}]}>*</Text>
                        <Text style={styles.AddMoneyItem.textFont}>:</Text>
                        <TextInput keyboardType={'numeric'} style={styles.AddMoneyItem.inputMoney} onChangeText={(number) => this.setState({amount: Number(number)})}></TextInput>
                        <Text style={styles.AddMoneyItem.textFont}>€</Text>
                    </View>
                    <View style={styles.AddMoneyItem.containerViewRow}>
                        <Text style={styles.AddMoneyItem.textFont}>Reason:</Text>
                        <TextInput style={styles.AddMoneyItem.inputReason} onChangeText={(text) => this.setState({reason: text})}></TextInput>
                    </View>
                    <View style={styles.AddMoneyItem.containerViewRow}>
                        <Text style={styles.AddMoneyItem.textFont}>Date incured:</Text>
                        <Text style={styles.AddMoneyItem.dateText}>{this.state.dateIncured.toDateString()}</Text>
                        <TouchableOpacity onPress={() => this.onPressCalendar('incured')}>
                            <ImageCalendar width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.AddMoneyItem.containerViewRow}>
                        <Text style={styles.AddMoneyItem.textFont}>Date due:</Text>
                        <Text style={styles.AddMoneyItem.dateText}>{this.state.dateDue !== "" ? this.state.dateDue.toDateString(): ""}</Text>
                        <TouchableOpacity onPress={() => this.onPressCalendar('due')}>
                            <ImageCalendar width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </View>*/}
                {this.state.visibleDatePickerIOSDue ? datePickerIOSDue : null}
                {this.state.visibleDatePickerIOSIncured ? datePickerIOSIncured : null}
                <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                    {/*<TouchableOpacity style={{flex: 1}}  underlayColor="white" onPress={() => this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Profile' })
                            ],
                        }))}>
                        <View style={[styles.AddMoneyItem.button2]}>
                            <Text style={styles.AddMoneyItem.buttonText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>*/}
                    
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.onPressAddMoney()} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button2]}>
                            <Text style={styles.AddMoneyItem.buttonText}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}