import React from 'react';
import {View, Text, Picker, TouchableOpacity} from 'react-native';
import Graph from '../components/Graph';
import * as styles from '../components/Styles';
import Firebase from '../components/Firebase';
import { snapshotToArray } from '../components/Functions';

export default class Statistic extends React.Component {
    constructor(){
        super();
        this.state = {
            graphViewWidth: 0,
            graphViewHeight: 0,
            users: [],
            option: "money",
            subOption: "gave",
            dataGave: [],
            dataReceived: [],
            dateStart: new Date(),
            dateEnd: new Date(),
            timeOption: "week",
            userValue: 'default',
            userIndex: 0
        }
    }

    componentDidMount() {
        this.loadUsers();
        this.getWeek(new Date());
        this.getStartEndOfWeek(new Date());
        this.loadData(this.state.option, this.state.userValue);
    }

    getWeek = (date) => {
        //https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
        let onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil( (((date - onejan) / 86400000) + onejan.getDay() + 1) / 7 );
    }

    getStartEndOfWeek = (date) => {
        //https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript
        var firstday = new Date(date.setDate(date.getDate() - date.getDay() + 1)); //+1 to start with Monday and not Sunday
        var lastday = new Date(date.setDate(date.getDate() - date.getDay() + 7)); //+7 so it ends with Sunday and not Saturday
        
        this.setState({dateStart: firstday, dateEnd: lastday});
    }

    pastWeek = () => {
        this.changeByWeek(-7); 
    }

    nextWeek = () => {
        this.changeByWeek(7);
    }

    pastMonth = () => {
        this.changeByMonth(-1);
    }

    nextMonth = () => {
        this.changeByMonth(1);
    }

    switchToWeek = () => {
        this.getStartEndOfWeek(new Date());
        this.loadData(this.state.option, this.state.userValue);
    }

    switchToMonth = () => {
        let date = new Date();
        var firstday = new Date(date.getFullYear(), date.getMonth(), 1); //first day of current month
        var days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); //get number of days
        var lastday = new Date(date.getFullYear(), date.getMonth(), days);
        
        this.setState({dateStart: firstday, dateEnd: lastday});
        this.loadData(this.state.option, this.state.userValue);
    }

    changeByMonth = (months) => {
        let start = this.state.dateStart;
        var firstday = new Date(start.getFullYear(), start.getMonth() + months, 1); //first day of current month

        let m = 0;
        if(months < 0)
            m = months - 1;
        else
            m = months;
        var days = new Date(start.getFullYear(), start.getMonth() - (months - 1), 0).getDate(); //get number of days
        var lastday = new Date(start.getFullYear(), start.getMonth() + months, days);
        
        this.setState({dateStart: firstday, dateEnd: lastday});
        this.loadData(this.state.option, this.state.userValue);
    }

    changeByWeek = (days) => {
        let start = this.state.dateStart;
        let end = this.state.dateEnd;
        var firstday = new Date(start.setDate(start.getDate() + days));
        var lastday = new Date(end.setDate(end.getDate() + days));
        
        this.setState({dateStart: firstday, dateEnd: lastday});
        this.loadData(this.state.option, this.state.userValue);
    }

    loadData = (path, userValue) => {
        if(userValue == 'default'){
            this.setState({dataGave: [], dataReceived: []});
            let data = Firebase.database.ref('transactions/users/'+Firebase.uid);
            data.child(path).once('value', (snapshot) => {
                if(snapshot.exists()){
                    snapshot.forEach((child) => {
                        this.getTransactions(path, child);
                    });
                }
            });  
        }
        else{
            let uid = userValue;
            this.setState({dataGave: [], dataReceived: []});
            let data = Firebase.database.ref('transactions/users/'+Firebase.uid+'/'+path+'/'+uid);
            data.once('value', (snapshot) => {
                if(snapshot.exists()){
                    this.getTransactions(path, snapshot);
                }
            });
        }
    }

    getTransactions = (path, child) => {
            Firebase.database.ref('users/'+child.key).once('value').then((user) => { 
                let objectGave = { username: user.val().username, data: [0, 0, 0, 0, 0, 0, 0] }
                let objectReceived = { username: user.val().username, data: [0, 0, 0, 0, 0, 0, 0] }

                if(this.state.timeOption != 'week'){
                    objectGave.data = [];
                    objectReceived.data = [];
                    for(let i=0; i<this.state.dateEnd.getDate(); i++){
                        objectGave.data.push(0);
                        objectReceived.data.push(0);
                    }
                }

                let childArray = snapshotToArray(child);
                childArray.reverse().forEach((transactionKey, index) => {
                    Firebase.database.ref('transactions/'+path+'/'+transactionKey.val()).once('value', (transaction) => {
                        if(new Date(transaction.val().date_incured) >= this.state.dateStart && new Date(transaction.val().date_incured) <= this.state.dateEnd){
                            //getDay() starts with Sunday - I need Monday

                            let index = 0;
                            if(this.state.timeOption == 'week')
                                index = new Date(transaction.val().date_incured).getDay() - 1;
                            else
                                index = new Date(transaction.val().date_incured).getDate() - 1;

                            if(index < 0)
                                index = 6;

                            if(path == 'money'){
                                if(transaction.val().from == Firebase.uid)
                                    objectGave.data[index] += transaction.val().amount;
                                else
                                    objectReceived.data[index] += transaction.val().amount;
                            }
                            else{
                                if(transaction.val().from == Firebase.uid)
                                    objectGave.data[index] += 1;
                                else
                                    objectReceived.data[index] +=1;
                            }
                        }

                        if(index == childArray.length - 1)
                            this.setState((previousState) => ({subOption: previousState.subOption, dataGave: [...previousState.dataGave, objectGave], dataReceived: [...previousState.dataReceived, objectReceived]}));
                    })
                });
            });
    }



    loadUsers = () => {
        Firebase.database.ref('/').once('value',
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    let data = Firebase.database.ref('/connections/' + Firebase.uid);
                    data.once('value', (snapshot) => {
                        this.setState({users: []});
                        let codeDefault = (
                            <Picker.Item key={"default"} label={"\t"+"All"} value={'default'} />
                        );
                        this.setState((previousState) => ({'users': [...previousState.users, codeDefault]}));
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(
                                (snapshotUser) => {
                                    let code = "";
                                    if(child.val() === true){
                                        code = (
                                            <Picker.Item key={child.key} label={"\t"+snapshotUser.val().username} value={child.key} />
                                        );
                                        this.setState((previousState) => ({'users': [...previousState.users, code]}));
                                    }
                                }
                            );
                        });
                    });
                }
            }
        );
    };

    render() {
        return(
            <View style={{flex: 1, padding: 10, backgroundColor: styles.mainColorGrey}}>
                <View style={{backgroundColor: styles.mainColorLightGrey}}>
                    <Picker
                        selectedValue={this.state.userValue}
                        style={{height: 40}}
                        onValueChange={(itemValue, itemIndex) =>(
                            this.setState({userIndex: itemIndex}),
                            this.setState({userValue: itemValue}),
                            this.loadData(this.state.option, itemValue)
                        )
                        }>
                        {this.state.users}
                    </Picker>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'stretch', backgroundColor: styles.mainColorLightGrey}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', backgroundColor: styles.mainColorLightGrey}}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({option: 'money'}); this.loadData('money', this.state.userValue)}}>
                            <View style={{color: "white", backgroundColor: styles.mainColorGreen, opacity: this.state.option === "money" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Money</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({option: 'items'}); this.loadData('items', this.state.userValue)}}>
                            <View style={{color: "white", backgroundColor: styles.mainColorGreen, opacity: this.state.option === "items" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Items</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', backgroundColor: styles.mainColorLightGrey}}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOption: 'gave'}))}>
                            <View style={{color: "white", backgroundColor: styles.mainColorOrange, opacity: this.state.subOption === "gave" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Gave</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOption: 'received'}))}>
                            <View style={{color: "white", backgroundColor: styles.mainColorOrange, opacity: this.state.subOption === "received" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Received</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'stretch', marginHorizontal: 50, marginTop: 10}}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({timeOption: 'week'}); this.switchToWeek()}}>
                            <View style={{color: "white", backgroundColor: styles.mainColorLightGrey2, opacity: this.state.timeOption === "week" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14, padding: 5}]}>Week</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({timeOption: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}); this.switchToMonth()}}>
                            <View style={{color: "white", backgroundColor: styles.mainColorLightGrey2, opacity: this.state.timeOption !== "week" ? 1 : 0.5}}>
                                <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14, padding: 5}]}>Month</Text>
                            </View>
                        </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{padding: 5, paddingHorizontal: 20}} onPress={() => this.state.timeOption == 'week' ? this.pastWeek() : this.pastMonth()}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={{color: 'white'}}>{`${this.state.dateStart.toLocaleDateString()}  -  ${this.state.dateEnd.toLocaleDateString()}`}</Text>
                    <TouchableOpacity style={{padding: 5, paddingHorizontal: 20, alignItems: 'flex-end'}} onPress={() => this.state.timeOption == 'week' ? this.nextWeek() : this.nextMonth()}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}} 
                    onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({graphViewWidth: width, graphViewHeight: height});
                        console.log(x,y,width,height);
                    }}
                >
                    <Graph height={this.state.graphViewHeight} width={this.state.graphViewWidth} padding={30} data={this.state.subOption == 'gave' ? this.state.dataGave : this.state.dataReceived} format={this.state.timeOption}></Graph>
                </View>
            </View>
            
        );
    }
}