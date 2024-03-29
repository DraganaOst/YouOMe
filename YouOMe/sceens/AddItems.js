import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity,Picker, DatePickerAndroid, DatePickerIOS, ScrollView} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import ImageCalendar from '../images/calendar.svg';

export default class AddItems extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'i_gave',
            array: [],
            dateIncured: new Date(),
            dateDue: "",
            name: 0,
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
                    data.once('value', (snapshot) => {
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

    onPressAddItem = async () => {
        let alertMessange = "Form wasn't filled in correctly: \n";

        if(this.state.userIndex === 0)
            alertMessange += " - choose a user\n";
        if(this.state.name == "")
            alertMessange += " - write the item's name";

        if(alertMessange !== "Form wasn't filled in correctly: \n")
            alert(alertMessange);
        else{
            let update = {};
            let ref = Firebase.database.ref('/confirmations/items');
            let uid = this.state.array[this.state.userIndex].key;
            
            let from = Firebase.uid;
            let to = uid;

            if(this.state.option === 'i_received'){
                from = uid;
                to = Firebase.uid;
            }

            let item = ref.push(
                {
                    'from': from, 
                    'to': to, 
                    'reason': this.state.reason,
                    'name': this.state.name,
                    'date_incured': this.state.dateIncured.toISOString(),
                    'date_due': this.state.dateDue !== "" ? this.state.dateDue.toISOString() : "",
                    'returned': false,
                    'request': Firebase.uid
                }
            );
            Firebase.database.ref('/confirmations/users/'+Firebase.uid+'/items/'+uid).push(item.key);
            Firebase.database.ref('/confirmations/users/'+uid+'/items/'+Firebase.uid).push(item.key);
            
            Firebase.database.ref().update(update);

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Profile' })
                ],
            }));
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
                {/*toggle I gave / I Received*/}
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
                {/*form*/}
                <ScrollView style={{flex: 1}}>
                    <View style={{flex:1, marginTop: 10, marginBottom: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>{this.state.option === 'i_gave' ? "To" : "From"}</Text>
                            <Text style={{color: 'red', fontSize: 18}}>*</Text>
                        </View>
                        {/*user picker*/}
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
                    {/*item name input*/}
                    <View style={{flex:1, marginVertical: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Item name</Text>
                            <Text style={{color: 'red', fontSize: 18}}>*</Text>
                        </View>
                        <View style={{backgroundColor: styles.mainColorLightGrey,marginHorizontal: 10}}>
                            <TextInput style={styles.AddMoneyItem.inputReason} onChangeText={(text) => {this.setState({name: text})}}></TextInput>
                        </View>   
                    </View>
                    {/*reason input*/}
                    <View style={{flex:1, marginVertical: 5}}>
                        <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Reason</Text>
                        <View style={{backgroundColor: styles.mainColorLightGrey, marginHorizontal: 10}}>
                            <TextInput style={styles.AddMoneyItem.inputReason} onChangeText={(text) => this.setState({reason: text})}></TextInput>
                        </View>       
                    </View>
                    {/*date incured input*/}
                    <View style={{flex:1, marginVertical: 5}}>
                        <Text style={{color: 'white', fontSize: 18, marginLeft: 20, fontWeight: 'bold'}}>Date incured</Text>     
                        <TouchableOpacity style={{backgroundColor: styles.mainColorLightGrey, paddingHorizontal: 20, marginHorizontal: 10}} onPress={() => this.onPressCalendar('incured')}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.AddMoneyItem.dateText}>{this.state.dateIncured.toDateString()}</Text>
                                <ImageCalendar width={24} height={24} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/*date due input*/}
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
                {this.state.visibleDatePickerIOSDue ? datePickerIOSDue : null}
                {this.state.visibleDatePickerIOSIncured ? datePickerIOSIncured : null}
                {/*confirm button*/}
                <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.onPressAddItem()} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button2]}>
                            <Text style={styles.AddMoneyItem.buttonText}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            
             {/*<View style={{flex: 1}}>
                <View style={styles.AddMoneyItem.containerButton}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'i_gave'}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {opacity: this.state.option === "i_gave" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Gave</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "i_received"}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {opacity: this.state.option === "i_received" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Received</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
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
                    <Text style={styles.AddMoneyItem.textFont}>Name</Text>
                    <Text style={[styles.AddMoneyItem.textFont, {color: 'red'}]}>*</Text>
                    <Text style={styles.AddMoneyItem.textFont}>:</Text>
                    <TextInput style={styles.AddMoneyItem.inputReason} onChangeText={(text) => this.setState({name: text})}></TextInput>
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
                {this.state.visibleDatePickerIOSDue ? datePickerIOSDue : null}
                {this.state.visibleDatePickerIOSIncured ? datePickerIOSIncured : null}
                <View style={{flexDirection: 'row', alignItems: 'stretch', flex:1, alignItems: 'flex-end'}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.onPressAddMoney()} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button2]}>
                            <Text style={styles.AddMoneyItem.buttonText}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>*/}
            </View>
        );
    }
}