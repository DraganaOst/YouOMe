import React from 'react';
import {Platform, Text, View, TextInput, TouchableOpacity, Image, Button, Picker, DatePickerAndroid, DatePickerIOS} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView } from 'react-native-gesture-handler';
import ImageArrowRight from '../images/arrow-right.svg';
import ImageArrowLeft from '../images/left-arrow.svg';

class Transaction extends React.Component {
    render() {
        let array = ['#8acb88','#648381','#575761','#ffbf46',"#E5E5E5"];
        let index = 0;

        let date = new Date(this.props.date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        let direction = this.props.from == 'me' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.from == 'me' ? <ImageArrowRight width={30} height={30}/> : null}
                <View style={{flex:1}}>
                    <View style={styles.Money.button}>
                    {this.props.from == 'me' 
                    ?
                        <View style={styles.Money.container}>
                            <View style={styles.Money.containerBalance}>
                                <Text style={{color: 'white', fontSize: 10}}>{date.getFullYear()}</Text>
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{date.getDay()}</Text>
                                <Text style={{color: 'white', fontSize: 15}}>{months[date.getMonth()]}</Text>
                            </View>
                            <View style={{flex: 5, marginHorizontal: 20}}>
                                <Text numberOfLines={2} style={{color: 'white', fontSize: 18}}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                <Text style={{color: 'white', fontSize: 15}}>{this.props.dateDue != "" ? 'Due date:' + this.props.dateDue : '"No due date"'}</Text>
                            </View>
                            <View style={{flex: 4, alignItems: 'flex-end', paddingRight: 10, backgroundColor: '#8acb88'}}>
                                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{this.props.amount}€</Text>  
                            </View>
                        </View>
                    :
                        <View style={styles.Money.container}>
                            <View style={{flex: 4, paddingLeft: 10, backgroundColor: '#8acb88'}}>
                                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{this.props.amount}€</Text>  
                            </View>
                            <View style={{flex: 5, marginHorizontal: 20, alignItems: 'flex-end'}}>
                                <Text numberOfLines={2} style={{color: 'white', fontSize: 18}}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                <Text style={{color: 'white', fontSize: 15}}>{this.props.dateDue != "" ? 'Due date:' + this.props.dateDue : '"No due date"'}</Text>
                            </View>
                            <View style={styles.Money.containerBalance}>
                                <Text style={{color: 'white', fontSize: 10}}>{date.getFullYear()}</Text>
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{date.getDay()}</Text>
                                <Text style={{color: 'white', fontSize: 15}}>{months[date.getMonth()]}</Text>
                            </View>    
                        </View>
                    }
                    </View>   
                </View>
                {this.props.from != 'me' ? <ImageArrowLeft width={30} height={30}/> : null}            
            </View>
        );
    }
}

export default class History extends React.Component {
    constructor(){
        super();
        this.state = {
            array: [],
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ title: this.props.navigation.state.params.username });
        this.loadTransactions();
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title'),
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText,
        headerTintColor: 'white',
    });

    loadTransactions = () => {
        let uid = this.props.navigation.state.params.uid;
        Firebase.database.ref('/transactions/users/'+Firebase.uid+'/money/'+uid).on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState((previousState) => ({'array': []}));
                snapshot.forEach((childSnapshot) => {
                    let transactionID = childSnapshot.val();

                    Firebase.database.ref('/transactions/money/' + transactionID).once('value').then((transactionSnapshot) => {
                        let code = (
                            <Transaction 
                                key={transactionID} 
                                date={transactionSnapshot.val().date_incured} 
                                dateDue={transactionSnapshot.val().date_due} 
                                reason={transactionSnapshot.val().reason} 
                                from={Firebase.uid === transactionSnapshot.val().from ? 'me' : 'other'}
                                amount={transactionSnapshot.val().amount}
                            />
                        );
        
                        this.setState((previousState) => ({'array': [...previousState.array, code]}));
                    });
                });
            }
        });
    }


    render() {
        return (
            <View style={{backgroundColor: "#E5E5E5", flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, paddingHorizontal: 20, paddingTop: 10, backgroundColor: 'white'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Me</Text>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.navigation.state.params.username}</Text>
                </View>
                <ScrollView style={{backgroundColor: "#E5E5E5", flex: 1}}>
                    {this.state.array}
                </ScrollView>
            </View>
            
        );
    }
}