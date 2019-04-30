import React from 'react';
import {Text, View} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView } from 'react-native-gesture-handler';
import ImageArrowRight from '../images/back-arrow (1).svg';
import ImageArrowLeft from '../images/back-arrow.svg';
import { snapshotToArray } from '../components/Functions';

class Transaction extends React.Component {
    render() {
        let date = new Date(this.props.date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        return (
            <View style={styles.History.containerTransaction}>
                {this.props.from == 'me' ? <ImageArrowRight width={30} height={30}/> : null}
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
                            <View style={styles.History.containerReason}>
                                <Text numberOfLines={2} style={styles.History.textReason}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                <Text style={styles.History.textMonth}>{this.props.dateDue != "" ? 'Due date:' + this.props.dateDue : '"No due date"'}</Text>
                            </View>
                            <View style={styles.History.containerMoney}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={styles.History.textMoney}>{this.props.amount}€</Text>
                                </View>  
                            </View>
                        </View>
                    :
                        <View style={styles.Money.container}>
                            <View style={styles.History.containerMoney2
                            }>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={styles.History.textMoney}>{this.props.amount}€</Text>
                                </View>    
                            </View>
                            <View style={[styles.History.containerReason, {alignItems: 'flex-end'}]}>
                                <Text numberOfLines={2} style={styles.History.textReason}>{this.props.reason != "" ? this.props.reason : '"No reason"'}</Text>
                                <Text style={styles.History.textMonth}>{this.props.dateDue != "" ? 'Due date:' + this.props.dateDue : '"No due date"'}</Text>
                            </View>
                            <View style={styles.Money.containerBalance}>
                                <Text style={styles.History.textYear}>{date.getFullYear()}</Text>
                                <Text style={styles.History.textDay}>{date.getDate()}</Text>
                                <Text style={styles.History.textMonth}>{months[date.getMonth()]}</Text>
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
    });

    loadTransactions = () => {
        let uid = this.props.navigation.state.params.uid;
        Firebase.database.ref('/transactions/users/'+Firebase.uid+'/money/'+uid).on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({'array': []});        
                snapshotToArray(snapshot).reverse().forEach((childSnapshot) => {
                    let transactionID = childSnapshot.val();

                    Firebase.database.ref('/transactions/money/' + transactionID).once("value", (transactionSnapshot) => {
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
            <View style={styles.History.container}>
                <View style={styles.History.containerBar}>
                    <Text style={styles.History.textBar}>Me</Text>
                    <Text style={styles.History.textBar}>{this.props.navigation.state.params.username}</Text>
                </View>
                <ScrollView style={styles.History.container}>
                    {this.state.array}
                </ScrollView>
            </View>
            
        );
    }
}