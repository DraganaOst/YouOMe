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
            subOptionGave: true,
            subOptionReceived: true,
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
        //this.loadData(this.state.option, this.state.userValue);
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

            if(this.state.userValue !== 'default'){
                objectGave.username = "gave";
                objectReceived.username = "received";
            }

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
                        let array = [];
                        let codeDefault = (
                            <Picker.Item key={"default"} label={"\t"+"All"} value={'default'} />
                        );
                        array.push(codeDefault);
                        let length = snapshot.numChildren();
                        let index = -1;
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(        
                                (snapshotUser) => {
                                    index++;
                                    let code = "";
                                    if(child.val() === true){
                                        code = (
                                            <Picker.Item key={child.key} label={"\t"+snapshotUser.val().username} value={child.key} />
                                        );
                                        array.push(code);
                                    }
                                    if(index == length - 1)
                                        this.setState({'users': array});
                                }
                            );                          
                        });
                    });
                }
            }
        );
    };

    onPickerValueChange = (option, itemValue) => {
        this.loadData(this.state.option, itemValue)
    }

    render() {
        return(
            <View style={{flex: 1, padding: 10, backgroundColor: styles.mainColorGrey}}>
                {/*user picker*/}
                <View style={{backgroundColor: styles.mainColorLightGrey}}>
                    <Picker
                        selectedValue={this.state.userValue}
                        style={{height: 40}}
                        onValueChange={(itemValue, itemIndex) =>(
                            this.setState({userIndex: itemIndex}),
                            this.setState({userValue: itemValue}),
                            this.onPickerValueChange(this.state.option, itemValue)
                        )
                        }>
                        {this.state.users}
                    </Picker>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'stretch', backgroundColor: styles.mainColorLightGrey}}>
                    {/*toggle money / items*/}
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
                    {
                        this.state.userValue === 'default' //if all users - only gave or received, else if one user gave and received 
                            ?
                                /*toggle gave / received*/
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
                            :
                                /*checkbox gave / received*/
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', backgroundColor: styles.mainColorLightGrey}}>
                                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOptionGave: !this.state.subOptionGave}))}>
                                        <View style={{color: "white", backgroundColor: styles.mainColorOrange, opacity: this.state.subOptionGave ? 1 : 0.5}}>
                                            <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Gave</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOptionReceived: !this.state.subOptionReceived}))}>
                                        <View style={{color: "white", backgroundColor: styles.mainColorOrange, opacity: this.state.subOptionReceived ? 1 : 0.5}}>
                                            <Text style={[styles.AddMoneyItem.buttonText, {fontSize: 14}]}>Received</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                    }
                </View>
                {/*toggle week / month*/}
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
                    {/*past week/month*/}
                    <TouchableOpacity style={{padding: 5, paddingHorizontal: 20}} onPress={() => this.state.timeOption == 'week' ? this.pastWeek() : this.pastMonth()}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{'<'}</Text>
                    </TouchableOpacity>
                    {/*current week/month*/}
                    <Text style={{color: 'white'}}>{`${this.state.dateStart.toLocaleDateString()}  -  ${this.state.dateEnd.toLocaleDateString()}`}</Text>
                    {/*next week/month*/}
                    <TouchableOpacity style={{padding: 5, paddingHorizontal: 20, alignItems: 'flex-end'}} onPress={() => this.state.timeOption == 'week' ? this.nextWeek() : this.nextMonth()}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                {/*chart*/}
                <View style={{flex:1}} 
                    onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({graphViewWidth: width, graphViewHeight: height});
                        console.log(x,y,width,height);
                    }}
                >
                {
                    this.state.userValue === 'default'
                        ?
                            <Graph 
                                height={this.state.graphViewHeight} 
                                width={this.state.graphViewWidth} 
                                padding={30} 
                                data={this.state.subOption == 'gave' ? this.state.dataGave : this.state.dataReceived} 
                                format={this.state.timeOption}
                            />
                        :
                            <Graph 
                                height={this.state.graphViewHeight} 
                                width={this.state.graphViewWidth} 
                                padding={30} 
                                data={[].concat(this.state.subOptionGave ? this.state.dataGave : [], this.state.subOptionReceived ? this.state.dataReceived : [])} 
                                format={this.state.timeOption}
                            />
                }
                    
                </View>
            </View>
            
        );
    }
}