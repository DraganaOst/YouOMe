import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ImageArrowRight from '../images/back-arrow (1).svg';
import ImageArrowLeft from '../images/back-arrow.svg';
import ImageArrowReturnLeft from '../images/curved-returing-arrow.svg';
import ImageArrowReturnRight from '../images/left-return-arrow.svg';
import { whileStatement } from '@babel/types';
import { snapshotToArray } from '../components/Functions';

class Transaction extends React.Component {
    render() {
        let date = "";
        if(this.props.returned == false)
            date = new Date(this.props.date);
        else
            date = new Date(this.props.returned);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        let dateDue = new Date(this.props.dateDue);
        return (
            <View style={styles.History.containerTransaction}>
                {this.props.from == 'me' && this.props.returned == false ? <ImageArrowRight width={30} height={30}/> : null}
                {this.props.from != 'me' && this.props.returned != false ? <ImageArrowReturnRight width={30} height={30}/> : null}  
                <View style={{flex:1}}>
                    <View style={styles.Money.button}>
                    {this.props.from == 'me' 
                    ?
                        <View style={styles.Money.container}>
                            <View style={styles.Money.containerBalance}>
                                <Text style={styles.History.textYear}>{date.getFullYear()}</Text>
                                <Text style={styles.History.textDay}>{date.getDate()}</Text>
                                <Text style={styles.History.textMonth}>{months[date.getMonth()]}</Text>
                            </View>

                            {this.props.returned == false 
                            ?
                                <View style={styles.History.containerReason}>
                                    <Text numberOfLines={2} style={styles.History.textReason}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                    <Text style={styles.History.textMonth}>{this.props.dateDue != "" ? dateDue.toDateString() : '"No due date"'}</Text>
                                </View>
                            :
                                <View style={styles.History.containerReason}>
                                    <Text style={styles.History.textReason}>RETURNED</Text>
                                </View>
                            }

                            <View style={styles.History.containerMoney}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={styles.History.textMoney}>{this.props.name}</Text>  
                                </View>
                            </View>
                        </View>
                    :
                        <View style={styles.Money.container}>
                            <View style={styles.History.containerMoney2}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={styles.History.textMoney}>{this.props.name}</Text>  
                                </View>
                            </View>
                            {this.props.returned == false 
                            ?
                                <View style={styles.History.containerReason}>
                                    <Text numberOfLines={2} style={styles.History.textReason}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                    <Text style={styles.History.textMonth}>{this.props.dateDue != "" ? dateDue.toDateString() : '"No due date"'}</Text>
                                </View>
                            :
                                <View style={styles.History.containerReason}>
                                    <Text style={styles.History.textReason}>RETURNED</Text>
                                </View>
                            }
                            <View style={styles.Money.containerBalance}>
                                <Text style={styles.History.textYear}>{date.getFullYear()}</Text>
                                <Text style={styles.History.textDay}>{date.getDate()}</Text>
                                <Text style={styles.History.textMonth}>{months[date.getMonth()]}</Text>
                            </View>    
                        </View>
                    }
                    </View>   
                </View>
                {this.props.from != 'me' && this.props.returned == false ? <ImageArrowLeft width={30} height={30}/> : null}     
                {this.props.from == 'me' && this.props.returned != false ? <ImageArrowReturnLeft width={30} height={30}/> : null}       
            </View>
        );
    }
}

class Item extends React.Component {
    render() {
        let date = new Date(this.props.date);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        let dateDue = new Date(this.props.dateDue);

        return (
            <View style={styles.Money.button}>
                <View style={[styles.Money.container, {flex: 1}]}>
                    <View style={[styles.Money.containerBalance, {paddingHorizontal: 5}]}>
                        <Text style={styles.History.textYear}>{date.getFullYear()}</Text>
                        <Text style={styles.History.textDay}>{date.getDate()}</Text>
                        <Text style={styles.History.textMonth}>{months[date.getMonth()]}</Text>
                    </View>
                    <View style={{flex: 3}}>
                        <View style={[styles.History.containerMoney2, {backgroundColor: this.props.from == 'me' ? styles.mainColorOrange : styles.mainColorGreen}]}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={[styles.History.textMoney, {fontSize: 15}]}>{this.props.name}</Text>  
                            </View>
                        </View>
                        <Text numberOfLines={1} style={{color: 'white', marginHorizontal: 5}}>{this.props.reson}</Text>
                        <Text numberOfLines={1} style={{color: 'white', marginHorizontal: 5}}>{this.props.dateDue != "" ? new Date(this.props.dateDue).toDateString() : ""}</Text>
                    </View>
                </View>              
            </View>
        );
    }
}

export default class HistoryItems extends React.Component {
    constructor(){
        super();
        this.state = {
            array: [],
            arrayMe: [],
            arrayUser: [],
            option: 'now',
            data: "",
            offRef: ""
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ title: this.props.navigation.state.params.username });
        this.loadTransactions();
    }

    componentWillUnmount(){
        this.data.off('value', this.offRef);
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title'),
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText,
        headerTintColor: 'white',
    });

    loadTransactions = () => {
        let uid = this.props.navigation.state.params.uid;
        this.data = Firebase.database.ref('/transactions/users/'+Firebase.uid+'/items/'+uid);
        this.offRef = this.data.on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState((previousState) => ({'array': []}));
                snapshotToArray(snapshot).reverse().forEach((childSnapshot) => {
                    let transactionID = childSnapshot.val();

                    Firebase.database.ref('/transactions/items/' + transactionID).once('value').then((transactionSnapshot) => {
                        if(transactionSnapshot.val().returned == false){
                            let code = (
                                <Item 
                                    key={transactionID} 
                                    date={transactionSnapshot.val().date_incured} 
                                    dateDue={transactionSnapshot.val().date_due} 
                                    reason={transactionSnapshot.val().reason} 
                                    name={transactionSnapshot.val().name}
                                    from={Firebase.uid === transactionSnapshot.val().from ? 'me' : 'other'}
                                />
                            );

                            if(transactionSnapshot.val().from == Firebase.uid)
                                this.setState((previousState) => ({'arrayUser': [code, ...previousState.arrayUser]}));   
                            else
                                this.setState((previousState) => ({'arrayMe': [code, ...previousState.arrayMe]}));
                        }

                        let code = (
                            <Transaction 
                                key={transactionID} 
                                date={transactionSnapshot.val().date_incured} 
                                dateDue={transactionSnapshot.val().date_due} 
                                reason={transactionSnapshot.val().reason} 
                                from={Firebase.uid === transactionSnapshot.val().from ? 'me' : 'other'}
                                name={transactionSnapshot.val().name}
                                returned={false}
                            />
                        );

                        this.setState((previousState) => ({'array': [code,...previousState.array]}));
                        
                        if(transactionSnapshot.val().returned != false){
                            let codeReturn = (
                                <Transaction 
                                    key={transactionID+'Returned'} 
                                    date={transactionSnapshot.val().date_incured} 
                                    dateDue={transactionSnapshot.val().date_due} 
                                    reason={transactionSnapshot.val().reason} 
                                    from={Firebase.uid === transactionSnapshot.val().from ? 'me' : 'other'}
                                    name={transactionSnapshot.val().name}
                                    returned={transactionSnapshot.val().returned}
                                />
                            );
                            this.setState((previousState) => ({'array': [codeReturn, ...previousState.array]}));
                        }

                        let arrayCopy = this.state.array;
                        arrayCopy.sort((a,b) => 
                            a.props.returned == false 
                                ? (b.props.returned == false 
                                    ? (new Date(a.props.date).getTime() < new Date(b.props.date).getTime() ? 1 : -1) 
                                    : (new Date(a.props.date).getTime() < new Date(b.props.returned).getTime() ? 1 : -1)
                                ) 
                                : (b.props.returned == false 
                                    ? (new Date(a.props.returned).getTime() < new Date(b.props.date).getTime() ? 1 : -1) 
                                    : (new Date(a.props.returned).getTime() < new Date(b.props.returned).getTime() ? 1 : -1)
                                )
                        );
                        this.setState({array: arrayCopy});
                            
                    });
                }); 
            }
        });
        
    }

    render() {
        return (
            <View style={styles.History.container}>
                <View style={styles.AddMoneyItem.containerButton}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'now'}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "now" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>Now</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "history"}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "history" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>History</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.History.containerBar}>
                    <Text style={styles.History.textBar}>Me</Text>
                    <Text style={styles.History.textBar}>{this.props.navigation.state.params.username}</Text>
                </View>
                {this.state.option === 'now' 
                ?
                    <View style={styles.History.container}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, marginRight: 5}}>
                                <ScrollView>{this.state.arrayMe}</ScrollView>
                            </View>
                            <View style={{flex: 1, marginLeft: 5}}>
                                <ScrollView>{this.state.arrayUser}</ScrollView>
                            </View>
                        </View>
                    </View>
                :
                    
                    <FlatList
                        data={this.state.array}
                        renderItem={({item}) => (
                            <Transaction 
                                    date={item.props.date} 
                                    dateDue={item.props.dateDue} 
                                    reason={item.props.reason} 
                                    from={item.props.from}
                                    name={item.props.name}
                                    returned={item.props.returned}
                                />
                        )}
                    />
            	}
            </View>
            
        );
    }
}